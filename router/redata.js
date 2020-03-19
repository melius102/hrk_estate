const express = require("express");
const router = express.Router();
const clog = console.log;

const { getItem, getList } = require('../modules/get_code');
const gov_openapi = require('../modules/gov_openapi');

router.get('/getlist/:depth/:code', (req, res) => {
    let depth = req.params.depth;
    let code = req.params.code;
    let list = getList(depth, code);
    res.send(list);
});

router.get('/data/:LAWD_CD/:DEAL_YMD/:pageNo/:numOfRows', (req, res) => {
    let LAWD_CD = req.params.LAWD_CD;
    let DEAL_YMD = req.params.DEAL_YMD;
    let pageNo = req.params.pageNo;
    let numOfRows = req.params.numOfRows;
    clog("data:", LAWD_CD, DEAL_YMD, pageNo, numOfRows);
    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, (err, json) => {
        if (err) { res.send('error'); }
        else { res.json(json); }
    });
});

module.exports = router;