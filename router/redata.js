const path = require('path');
const express = require("express");
const { pool, errMessage, sqlExecute, readItems } = require('../modules/mysql-conn');
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

router.post('/data/:LAWD_CD/:DEALYMD1/:DEALYMD2/:pageNo/:numOfRows', async (req, res) => {
    let LAWD_CD = req.params.LAWD_CD;
    let DEALYMD1 = req.params.DEALYMD1;
    let DEALYMD2 = req.params.DEALYMD2;
    let pageNo = req.params.pageNo;
    let numOfRows = req.params.numOfRows;

    let filters = req.body.filters;

    clog("data:", LAWD_CD, DEALYMD1, DEALYMD2, pageNo, numOfRows);
    // clog('filters', filters);

    if (!validateDate(DEALYMD1, DEALYMD2)) {
        let body = { numOfRows, pageNo, totalCount: 0, items: { item: [] } };
        res.json(body);
        return;
    }

    // check to have data in DB
    // let sql = 'SELECT fine FROM queries WHERE LAWD_CD=? AND DEAL_YMD=?';
    // let sqlVals = [LAWD_CD, , `${DEAL_YMD}01`];
    // let result = await sqlExecute(sql, sqlVals, 'query');

    // let dbState = 0;
    // if (result[0][0]) {
    //     if (result[0][0].fine == 1) dbState = 1; // hava data, so read from db
    // } else { // no data
    //     // run worker
    //     worker.postMessage({ cmd: 'readOne', LAWD_CD, DEAL_YMD });
    // }

    let dbState = 1;
    if (dbState) {
        let body = await readItems(LAWD_CD, DEALYMD1, DEALYMD2, pageNo, numOfRows, filters);
        res.json(body);
    } else {
        // gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, (err, json) => {
        //     if (err) { res.send('error'); }
        //     else {
        //         let body = json.response.body;
        //         res.json(body);
        //     }
        // });

        // prevent getting data directly from api
        let body = { numOfRows, pageNo, totalCount: 0, items: { item: [] } };
        res.json(body);
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