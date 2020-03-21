const gov_openapi = require('../modules/gov_openapi');
const { clog, odfKeys, o2dKeys } = require('./util');
const { pool, errMessage, sqlExecute, createTable } = require('../modules/mysql-conn');
const { Worker, isMainThread, parentPort } = require('worker_threads');

clog('isMainThread:', isMainThread); // false

parentPort.on('message', (requ) => {
    switch (requ.cmd) {
        case 'readFull':
            readFull(requ);
            break;
    }
});

function readFull(requ) {
    let { LAWD_CD, DEAL_YMD } = requ;
    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, "1", "2", (err, json) => {
        if (err) { res.send('error'); }
        else {
            let { totalCount } = json.response.body;
            clog('tatalCount(worker)', totalCount);
            getJSONDATA(LAWD_CD, DEAL_YMD, totalCount);
        }
    });
}

function getJSONDATA(LAWD_CD, DEAL_YMD, numOfRows) {
    gov_openapi.getJSON(LAWD_CD, DEAL_YMD, "1", numOfRows, (err, json) => {
        if (err) { res.send('error'); }
        else {
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
            clog('item.length', body.items.item.length);
            insertDATA(LAWD_CD, DEAL_YMD, body);
        }
    });
}

async function insertDATA(LAWD_CD, DEAL_YMD, body) {

    let tableName = `contracts${LAWD_CD}`;
    await createTable(tableName);

    // queries
    let sql = "INSERT INTO queries SET LAWD_CD=?, DEAL_YMD=?";
    let sqlVals = [LAWD_CD, `${DEAL_YMD}01`];
    let result = await sqlExecute(sql, sqlVals, 'query');

    let items = body.items.item;
    let keys = Object.keys(o2dKeys);
    let values = Object.values(o2dKeys);

    // if road_nm==null? change to outer join
    let sqlr = "INSERT INTO road_names SET region_cd=?, rn_cd=?, road_nm=?"; // road_names
    let sqld = "INSERT INTO dong_names SET region_cd=?, dn_cd=?, dong_nm=?"; // dong_names
    let sqlc = `INSERT INTO ${tableName} SET amount=?, cntr_date=?`; // contracts
    for (let key of keys) sqlc += `, ${key}=?`;

    let errors = 0;
    let affectedRows = 0;
    clog('items.length', items.length);
    // for (let item of items) {}
    for (let index = 0; index < items.length; index++) {
        let item = items[index];

        let sqlVals, result;

        // road_names
        sqlVals = [item[odfKeys.region_cd], item[odfKeys.rn_cd], item[odfKeys.road_nm]];
        result = await sqlExecute(sqlr, sqlVals, 'road', { index, apt: item['아파트'], dn: item['법정동'] });

        // dong_names
        sqlVals = [item[odfKeys.region_cd], item[odfKeys.dn_cd], item[odfKeys.dong_nm]];
        result = await sqlExecute(sqld, sqlVals, 'dong');

        // contracts
        let amount = '';
        let amount_ = item['거래금액'].split(',');
        for (let v of amount_) amount += v;

        let cntr_date = item['년'] + ('0' + item['월']).slice(-2) + ('0' + item['일']).slice(-2);
        sqlVals = [amount, cntr_date];
        for (let v of values) sqlVals.push(item[v]);
        result = await sqlExecute(sqlc, sqlVals, 'cntr');
        if (index % 20 == 0) clog(`index: ${index}/${items.length}`);
    }
    clog('total items:', items.length);
    clog('total affectedRows:', affectedRows);
    clog('total errors:', errors);

    // queries update for finishing storing
    sql = "UPDATE queries SET fine=? WHERE LAWD_CD=? AND DEAL_YMD=?";
    sqlVals = [1, LAWD_CD, `${DEAL_YMD}01`];
    result = await sqlExecute(sql, sqlVals, 'query');
}
