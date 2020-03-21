const http = require('http');
const parserf = require('fast-xml-parser');
const { clog } = require('./util');

const {
    Worker,
    isMainThread,
    parentPort
} = require('worker_threads');

clog('isMainThread:', isMainThread); // false

parentPort.on('message', (request) => {
    // method: callback function
    http.get(request.URL, (result) => {
        // const { statusCode } = result;
        let rawData = '';
        result.setEncoding('utf8');
        result.on('data', (chunk) => { rawData += chunk; });
        result.on('end', () => {
            let xml = rawData;
            let json = parserf.parse(xml, { parseNodeValue: false });
            let { body } = json.response; // totalCount: string
            clog('in worker');
            clog(body.items.item);
        });
    });
});
