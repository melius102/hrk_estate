const production = true;
const log = console.log;
const http = require('http');
const path = require('path');

// https://expressjs.com/en/resources/middleware.html
// https://expressjs.com/en/guide/migrating-4.html
const express = require('express');
const gov_openapi = require('./modules/gov_openapi');
const { getItem, getList } = require('./modules/get_code');

const app = express();
const port = process.env.PORT || 8080; // for gabia

let webpack, webpackDevMiddleware, config, compiler;
if (!production) {
    webpack = require('webpack');
    webpackDevMiddleware = require('webpack-dev-middleware');

    // webpack: auto rebuild
    config = require('./webpack.config.js');
    compiler = webpack(config);

    // middleware
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
}

// app.use(methodOverride());
// app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer());
app.use('/public', express.static(path.join(__dirname, './dist/public')));
app.use('/data', express.static(path.join(__dirname, './dist/data')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

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

// https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
// https://www.youtube.com/channel/UCuRGaS7uXLAIrCrxKN_Ke7g

// https://webpack.js.org/guides/development/#choosing-a-development-tool
// webpack-dev-server
// webpack-dev-middleward