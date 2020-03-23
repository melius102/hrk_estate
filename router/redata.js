const path = require('path');
const express = require("express");
const { pool, errMessage, sqlExecute, createTable } = require('../modules/mysql-conn');
const { clog, odfKeys, d2oKeys, validateDate } = require('../modules/util');
const { Worker, isMainThread } = require('worker_threads');

const router = express.Router();

const { getItem, getList } = require('../modules/get_code');
const gov_openapi = require('../modules/gov_openapi');

// worker
const worker = new Worker(path.join(__dirname, '../modules/worker.js'));
worker.on('error', (err) => clog('worker error:', err));

clog('isMainThread:', isMainThread); // true

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

    if (!validateDate(DEAL_YMD)) {
        let body = { numOfRows, pageNo, totalCount: 0, items: { item: [] } };
        res.json(body);
        return;
    }

    // check to have data in DB
    let sql = 'SELECT fine FROM queries WHERE LAWD_CD=? AND DEAL_YMD=?';
    let sqlVals = [LAWD_CD, , `${DEAL_YMD}01`];
    let result = await sqlExecute(sql, sqlVals, 'query');

    let dbState = 0;
    if (result[0][0]) {
        if (result[0][0].fine == 1) dbState = 1; // hava data, so read from db
    } else { // no data
        // run worker
        worker.postMessage({ cmd: 'readOne', LAWD_CD, DEAL_YMD });
    }

    if (dbState) {
        let sql = `SELECT COUNT(*) as totalCount FROM contracts${LAWD_CD}
        WHERE cntr_date BETWEEN '${DEAL_YMD.slice(0, -2)}-${DEAL_YMD.slice(-2)}-01'
        AND '${DEAL_YMD.slice(0, -2)}-${DEAL_YMD.slice(-2)}-31'`;
        let result = await sqlExecute(sql, [], 'query');
        let { totalCount } = result[0][0];
        // clog(totalCount);

        // INNER JOIN road_names as rn : 483
        // LEFT OUTER JOIN road_names as rn : 487
        // let sql = `SELECT * FROM contracts${LAWD_CD} ORDER BY dn_cd`; // DESC
        sql = `SELECT
        FORMAT(ct.amount, 0) AS amount,
        CONCAT(ct.cnst_year) AS cnst_year,
        DATE_FORMAT(ct.cntr_date, '%Y') AS cntr_year,
        DATE_FORMAT(ct.cntr_date, '%c') AS cntr_month,
        DATE_FORMAT(ct.cntr_date, '%e') AS cntr_day,
        ct.apt, ct.floor,
        CONCAT(ct.area) AS area,
        CONCAT(ct.region_cd) AS region_cd,
        rn.road_nm,
        CONCAT(ct.rn_cd) AS rn_cd,
        CONCAT(ct.rn_sn_cd) AS rn_sn_cd,
        CONCAT(ct.rn_bldg_mc) AS rn_bldg_mc,
        CONCAT(ct.rn_bldg_sc) AS rn_bldg_sc,
        dn.dong_nm,
        CONCAT(ct.dn_cd) AS dn_cd,
        CONCAT(ct.dn_mc) AS dn_mc,
        CONCAT(ct.dn_sc) AS dn_sc,
        CONCAT(ct.dn_ln_cd) AS dn_ln_cd,
        CONCAT(ct.ln) AS ln 
        FROM contracts${LAWD_CD} as ct
        INNER JOIN dong_names as dn
        ON ct.region_cd = dn.region_cd
        AND ct.dn_cd = dn.dn_cd
        LEFT OUTER JOIN road_names as rn
        ON ct.region_cd = rn.region_cd
        AND ct.rn_cd = rn.rn_cd
        WHERE cntr_date BETWEEN '${DEAL_YMD.slice(0, -2)}-${DEAL_YMD.slice(-2)}-01'
        AND '${DEAL_YMD.slice(0, -2)}-${DEAL_YMD.slice(-2)}-31'
        ORDER BY ct.dn_cd, ct.cntr_date, ct.area DESC
        LIMIT ${(Number(pageNo) - 1) * Number(numOfRows)}, ${numOfRows}`;
        let sqlVals = [LAWD_CD, , `${DEAL_YMD}01`];
        result = await sqlExecute(sql, sqlVals, 'query');
        let items = result[0];
        // clog(items[0]);
        // clog(items.length);
        let body = { numOfRows, pageNo, totalCount, items: { item: [] } };

        let keys = Object.keys(d2oKeys);
        let values = Object.values(d2oKeys);
        items.forEach(item => {
            let newItem = {};
            for (let i in keys) newItem[values[i]] = item[keys[i]];
            body.items.item.push(newItem);
        });
        res.json(body);

    } else { // if not (dbState)
        gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, (err, json) => {
            if (err) { res.send('error'); }
            else {
                let body = json.response.body;
                res.json(body);
            }
        });
    }
});

router.get('/readMonth/:DEAL_YMD', async (req, res) => {
    let DEAL_YMD = req.params.DEAL_YMD;
    if (validateDate(DEAL_YMD)) {
        worker.postMessage({ cmd: 'readMonth', DEAL_YMD });
        res.json({ res: 'start gethering' });
    } else {
        res.json({ res: 'bad query' });
    }
});

module.exports = router;