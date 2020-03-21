const express = require("express");
const { pool, errMessage, sqlExecute, createTable } = require('../modules/mysql-conn');
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

    let tableName = `contracts${LAWD_CD}`;
    await createTable(tableName);

    // queries
    let sql = "INSERT INTO queries SET LAWD_CD=?, DEAL_YMD=?";
    let sqlVals = [LAWD_CD, `${DEAL_YMD}01`];
    let result = await sqlExecute(sql, sqlVals, 'query');

    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, async (err, json) => {
        if (err) { res.send('error'); }
        else {
            res.json(json);
            let items = json.response.body.items.item;

            let keys = Object.keys(ctKeys);
            let values = Object.values(ctKeys);

            let sqlr = "INSERT INTO road_names SET region_cd=?, rn_cd=?, road_nm=?"; // road_names
            let sqld = "INSERT INTO dong_names SET region_cd=?, dn_cd=?, dong_nm=?"; // dong_names
            let sqlc = `INSERT INTO ${tableName} SET amount=?, cntr_date=?`; // contracts
            for (let key of keys) sqlc += `, ${key}=?`;
            // clog(sqlc);

            let errors = 0;
            let affectedRows = 0;

            // for (let item of items) {}
            clog('items.length', items.length);
            for (let index = 0; index < items.length; index++) {
                let item = items[index];

                let sqlVals, result;

                // road_names
                sqlVals = [item[odKeys.region_cd], item[odKeys.rn_cd], item[odKeys.road_nm]];
                result = await sqlExecute(sqlr, sqlVals, 'road');

                // dong_names
                sqlVals = [item[odKeys.region_cd], item[odKeys.dn_cd], item[odKeys.dong_nm]];
                result = await sqlExecute(sqld, sqlVals, 'dong');

                // contracts
                let amount = '';
                let amount_ = item['거래금액'].split(',');
                for (let v of amount_) amount += v;

                let cntr_date = item['년'] + ('0' + item['월']).slice(-2) + ('0' + item['일']).slice(-2);
                sqlVals = [amount, cntr_date];
                for (let v of values) sqlVals.push(item[v]);
                result = await sqlExecute(sqlc, sqlVals, 'cntr');
            }
            clog('total items:', items.length);
            clog('total affectedRows:', affectedRows);
            clog('total errors:', errors);
        }
    });
});

module.exports = router;