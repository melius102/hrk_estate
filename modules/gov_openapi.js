// https://www.data.go.kr/
// http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?_wadl&type=xml
const log = console.log;

const parser = require('xml2json');
const http = require('http');
const pKeys = require('./private_keys');

const serviceKey = pKeys.serviceKey;
const domain = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage";
const path = "/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

function getJSON(LAWD_CD, DEAL_YMD, pageNo, numOfRows, cb) {
    let URL = `${domain + path}?LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}&serviceKey=${serviceKey}`;
    http.get(URL, (result) => {
        // const { statusCode } = result;
        let rawData = '';
        result.setEncoding('utf8');
        result.on('data', (chunk) => { rawData += chunk; });
        result.on('end', () => {
            let xml = rawData;
            try {
                cb(null, parser.toJson(xml));
            } catch (err) {
                cb(err);
            }
        });
    });
}

let gov_openapi = {
    getJSON
};

module.exports = gov_openapi;