const log = console.log;
const http = require('http');
const express = require('express');

const gov_openapi = require('./modules/gov_openapi');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('./public'));

app.get('/data/:LAWD_CD/:DEAL_YMD', (req, res) => {
    let LAWD_CD = req.params.LAWD_CD;
    let DEAL_YMD = req.params.DEAL_YMD;
    log("data:", LAWD_CD, DEAL_YMD);
    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, (err, json) => {
        if (err) {
            res.send('error');
        } else {
            res.json(json);
        }
    });
});

const server = http.createServer(app);
server.listen(port, function () {
    log("http://192.168.0.64:" + port);
});
