// https://www.data.go.kr/
// http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?_wadl&type=xml
const http = require('http');
const path = require('path');
// const parserx = require('xml2json'); // err only in worker: Module did not self-register due to node_expat
const parserf = require('fast-xml-parser');
const { Worker, isMainThread } = require('worker_threads');

const { clog } = require('./util');
// const util = require('util'); // for promisify
// const pKeys = require('./private_keys');

const serviceKey = process.env.serviceKey;
const domain = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage";
const gPath = "/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

// worker
// const worker = new Worker(path.join(__dirname, 'worker.js'));
let worker;
clog('isMainThread:', isMainThread); // true

function getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, cb) {
    // let URL = `${domain + gPath}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}`;
    let URL = `${domain + gPath}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=1&numOfRows=2&serviceKey=${serviceKey}`;

    // method: callback function
    http.get(URL, (result) => {
        // const { statusCode } = result;
        let rawData = '';
        result.setEncoding('utf8');
        result.on('data', (chunk) => { rawData += chunk; });
        result.on('end', () => {
            let xml = rawData;
            try { // for JSON.parse(parserx.toJson(xml))
                // let json = JSON.parse(parserx.toJson(xml)); // change to parserf for worker
                let json = parserf.parse(xml, {
                    // parseTrueNumberOnly: true, // dont need
                    // attrValueProcessor: val => val, // not work
                    // tagValueProcessor: val => val, // work
                    parseNodeValue: false
                });

                let { totalCount } = json.response.body;
                getJSONDATA(LAWD_CD, DEAL_YMD, pageNo, totalCount, cb); // all string
            } catch (err) {
                cb(err);
            }
        });
    });
}

function getJSONDATA(LAWD_CD, DEAL_YMD, pageNo, numOfRows, cb) {
    let URL = `${domain + gPath}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}`;

    worker = new Worker(path.join(__dirname, 'worker.js'));
    worker.postMessage({ URL });
    worker.on('error', (err) => clog('worker error:', err));

    // method: callback function
    http.get(URL, (result) => {
        // const { statusCode } = result;
        let rawData = '';
        result.setEncoding('utf8');
        result.on('data', (chunk) => { rawData += chunk; });
        result.on('end', () => {
            let xml = rawData;
            try { // for xml parsing
                // clog(xml);
                let json = parserf.parse(xml, { parseNodeValue: false });
                let { body } = json.response; // totalCount: string
                let totalCount = body.totalCount;
                if (totalCount == '0') {
                    // body.items.item = [];        // x: items: {} >> {item:[]}
                    body.items = { item: [] };      // f: items: '' >> {item:[]}
                } else if (totalCount == '1') {
                    body.items.item = [body.items.item];   // items: {item: {}} >> {item: [{}]}
                } else if (!(body.items.item instanceof Array)) {
                    clog('!(body.items.item instanceof Array)');
                    body.items.item = [body.items.item];   // items: {item: {}} >> {item: [{}]}
                }
                // clog('totalCount', totalCount);
                // clog(body.items);
                // clog(body.items.item instanceof Array); // transform to array
                cb(null, json);
            } catch (err) {
                cb(err);
            }
        });
    });

    // method: promise
    // https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
    // const pmGet = util.promisify(http.get);
    // pmGet(URL).then((result) => { }).catch(err => clog(err));
}

let gov_openapi = {
    getJSON
};

module.exports = gov_openapi;