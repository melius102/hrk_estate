const http = require('http');
const path = require('path');
const { clog } = require('./modules/util');

// https://expressjs.com/en/resources/middleware.html
// https://expressjs.com/en/guide/migrating-4.html
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), './env/.env') });

// routers
const indexRouter = require('./router/index');
const redataRouter = require('./router/redata');

const app = express();
const port = process.env.PORT || process.env.PORT2; // for gabia
clog('process.env.PORT', process.env.PORT);
clog('process.env.NODE_ENV', process.env.NODE_ENV);

let webpack, webpackDevMiddleware, config, compiler;
if (process.env.nodenv !== 'production') {
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

// routers
app.use('/', indexRouter);
app.use('/redata', redataRouter);

const server = http.createServer(app);
server.listen(port, function () {
    clog("http://192.168.0.64:" + port);
});

// https://programmingsummaries.tistory.com/375
process.on('uncaughtException', function (error) {
    clog('uncaughtException occur:');
    clog(error);
});


// https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
// https://www.youtube.com/channel/UCuRGaS7uXLAIrCrxKN_Ke7g

// https://webpack.js.org/guides/development/#choosing-a-development-tool
// webpack-dev-server
// webpack-dev-middleward