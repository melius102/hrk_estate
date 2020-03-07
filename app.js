const log = console.log;
const http = require('http');
const express = require('express');

const gov_openapi = require('./modules/gov_openapi');
const { getItem, getList } = require('./modules/get_code');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('./dist/public'));

app.get('/data/:LAWD_CD/:DEAL_YMD/:pageNo/:numOfRows', (req, res) => {
    let LAWD_CD = req.params.LAWD_CD;
    let DEAL_YMD = req.params.DEAL_YMD;
    let pageNo = req.params.pageNo;
    let numOfRows = req.params.numOfRows;
    log("data:", LAWD_CD, DEAL_YMD, pageNo, numOfRows);
    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, (err, json) => {
        if (err) { res.send('error'); }
        else { res.json(json); }
    });
});

app.get('/getlist/:depth/:code', (req, res) => {
    let depth = req.params.depth;
    let code = req.params.code;
    let list = getList(depth, code);
    res.send(list);
});

const server = http.createServer(app);
server.listen(port, function () {
    log("http://192.168.0.64:" + port);
});