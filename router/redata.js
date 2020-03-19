const express = require("express");
const { pool, sqlAction } = require('../modules/mysql-conn');
const { clog, odKeys, ctKeys } = require('../modules/util');

const router = express.Router();

const { getItem, getList } = require('../modules/get_code');
const gov_openapi = require('../modules/gov_openapi');

router.get('/getlist/:depth/:code', (req, res) => {
    let depth = req.params.depth;
    let code = req.params.code;
    let list = getList(depth, code);
    res.send(list);
});

router.get('/data/:LAWD_CD/:DEAL_YMD/:pageNo/:numOfRows', async (req, res) => {
    let LAWD_CD = req.params.LAWD_CD;
    let DEAL_YMD = req.params.DEAL_YMD;
    let pageNo = req.params.pageNo;
    let numOfRows = req.params.numOfRows;
    clog("data:", LAWD_CD, DEAL_YMD, pageNo, numOfRows);

    // queries
    let sql = "INSERT INTO queries SET LAWD_CD=?, DEAL_YMD=?";
    let sqlVals = [LAWD_CD, `${DEAL_YMD}01`];
    let result;
    try {
        result = await pool.execute(sql, sqlVals);
    } catch (err) { clog(`err(query): ${err.code}(${err.errno}) ${err.sqlMessage}`); }

    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, async (err, json) => {
        if (err) { res.send('error'); }
        else {
            res.json(json);
            let items = JSON.parse(json).response.body.items.item;

            let keys = Object.keys(ctKeys);
            let values = Object.values(ctKeys);

            let sqlr = "INSERT INTO road_names SET region_cd=?, rn_cd=?, road_nm=?"; // road_names
            let sqld = "INSERT INTO dong_names SET region_cd=?, dn_cd=?, dong_nm=?"; // dong_names
            let sqlc = "INSERT INTO contracts SET amount=?, cntr_date=?"; // contracts
            for (let key of keys) sqlc += `, ${key}=?`;
            // clog(sqlc);

            let errors = 0;
            let affectedRows = 0;
            for (let item of items) {

                let sqlVals, result;

                // road_names
                sqlVals = [item[odKeys.region_cd], item[odKeys.rn_cd], item[odKeys.road_nm]];
                try {
                    result = await pool.execute(sqlr, sqlVals);
                } catch (err) { clog(`err(road): ${err.code}(${err.errno}) ${err.sqlMessage}`); }

                // dong_names
                sqlVals = [item[odKeys.region_cd], item[odKeys.dn_cd], item[odKeys.dong_nm]];
                try {
                    result = await pool.execute(sqld, sqlVals);
                } catch (err) { clog(`err(dong): ${err.code}(${err.errno}) ${err.sqlMessage}`); }

                // contracts
                let amount = '';
                let amount_ = item['거래금액'].split(',');
                for (let v of amount_) amount += v;

                let cntr_date = item['년'] + ('0' + item['월']).slice(-2) + ('0' + item['일']).slice(-2);
                sqlVals = [amount, cntr_date];
                for (let v of values) {
                    if (item[v]) sqlVals.push(item[v]);
                    else sqlVals.push(null);
                }
                try {
                    result = await pool.execute(sqlc, sqlVals);
                    // clog('affectedRows:', result[0].affectedRows);
                    // affectedRows += result[0].affectedRows;
                } catch (err) { clog(`err(cntr): ${err.code}(${err.errno}) ${err.sqlMessage}`); };
            }
            clog('total items:', items.length);
            clog('total affectedRows:', affectedRows);
            clog('total errors:', errors);
        }
    });
});

module.exports = router;