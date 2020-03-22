// https://www.data.go.kr/
// http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?_wadl&type=xml
const http = require('http');
// const util = require('util'); // for promisify
// const parserx = require('xml2json'); // err only in worker: Module did not self-register due to node_expat
const parserf = require('fast-xml-parser');

const { clog } = require('./util');
// const pKeys = require('./private_keys');

const serviceKey = process.env.serviceKey;
const domain = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage";
const gPath = "/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

function getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, cb) {

    let gURL = `${domain + gPath}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}`;
    http.get(gURL, (result) => { // method: callback function
        // const { statusCode } = result;
        let rawData = '';
        result.setEncoding('utf8');
        result.on('data', (chunk) => { rawData += chunk; });
        result.on('end', () => {
            let xml = rawData;
            // clog(xml);
            try { // for JSON.parse(parserx.toJson(xml))
                // let json = JSON.parse(parserx.toJson(xml)); // change to parserf for worker
                let json = parserf.parse(xml, {
                    // parseTrueNumberOnly: true, // dont need
                    // attrValueProcessor: val => val, // not work
                    // tagValueProcessor: val => val, // work
                    parseNodeValue: false
                });
                cb(null, json);
            } catch (err) {
                cb(err);
            }
        });
    });
}

function getJSONProm(LAWD_CD, DEAL_YMD, pageNo, numOfRows) {
    return new Promise(function (resolve, reject) {
        let gURL = `${domain + gPath}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}`;
        http.get(gURL, (result) => { // method: callback function
            // const { statusCode } = result;
            let rawData = '';
            result.setEncoding('utf8');
            result.on('data', (chunk) => { rawData += chunk; });
            result.on('end', () => {
                let xml = rawData;
                // clog(xml);
                try {
                    let json = parserf.parse(xml, { parseNodeValue: false });
                    resolve(json);
                } catch (err) { reject(err); }
            });
        });
    });

    // method: promise
    // https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
    // const pmGet = util.promisify(http.get);
    // pmGet(gURL).then((result) => { }).catch(err => clog(err));
}

let gov_openapi = {
    getJSON, getJSONProm
};

module.exports = gov_openapi;