// https://github.com/mysqljs/mysql#connection-options
// const mysql = require('mysql2'); // normal version: mysql2/index.js
const mysql = require('mysql2/promise'); // promise version: mysql2/promise.js
const schedule = require('node-schedule');
const { clog, LAWD_CDList, d2oKeys } = require('./util');

let pool = mysql.createPool({
    host: process.env.mysqlhost,
    user: process.env.mysqluser,
    password: process.env.mysqlpass,
    port: process.env.mysqlport,
    database: process.env.mysqldb,
    connectionLimit: 15
    // connectTimeout: 30000,
});

async function sqlAction(pool, sql, sqlVals) {
    const connect = await pool.getConnection();
    const result = await connect.query(sql, sqlVals);
    connect.release(); // release pool
    return result;
}

const dbErrnoList = [1062, 1048];
const noDisplayErrnoList = [1062];

function errMessage(err, title, index = null) {
    if (noDisplayErrnoList.includes(err.errno)) {
    } else if (dbErrnoList.includes(err.errno)) {
        if (index == null) clog(`err(${title}): ${err.code}(${err.errno}) ${err.sqlMessage}`);
        else clog(`err(${title}): [${index.dn} ${index.apt}] ${err.code}(${err.errno}) ${err.sqlMessage}`);
    } else {
        if (index == null) clog(`err(${title}):`);
        else {
            clog(`err(${title},${index.index}):`);
            clog(`err(${title},${index.apt}):`);
            clog(`err(${title},${index.dn}):`);
        }
        clog(err);
    }
}

async function sqlExecute(sql, sqlVals, title, index = null) {
    let result;
    let newSqlVals = sqlVals.map((v) => {
        if (v) return v;
        else return null;
    });

    try {
        result = await pool.execute(sql, newSqlVals);
        return result;
    } catch (err) { errMessage(err, title, index); }
}

async function createTable(tableName) {

    // CREATE TABLES  IF NOT EXISTS table_name
    let sql = `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = '${process.env.mysqldb}'
        AND table_name = '${tableName}'
        ) AS exflag`;
    let result;

    try {
        result = await pool.execute(sql);
        if (!result[0][0].exflag) {
            // create table
            sql = `CREATE TABLE ${tableName} (
                amount int(10) unsigned NOT NULL,
                cnst_year year(4) NOT NULL,
                cntr_date date NOT NULL,
                apt varchar(255) NOT NULL,
                floor varchar(45) NOT NULL,
                area float NOT NULL,
                region_cd int(5) unsigned zerofill NOT NULL,
                rn_cd int(7) unsigned zerofill NOT NULL,
                rn_sn_cd int(2) unsigned zerofill NOT NULL,
                rn_bldg_mc int(5) unsigned zerofill NOT NULL,
                rn_bldg_sc int(5) unsigned zerofill NOT NULL,
                dn_cd int(5) unsigned zerofill NOT NULL,
                dn_mc int(4) unsigned zerofill NOT NULL,
                dn_sc int(4) unsigned zerofill NOT NULL,
                dn_ln_cd int(1) unsigned zerofill NOT NULL,
                ln int(10) unsigned NOT NULL,
                PRIMARY KEY (amount,cnst_year,cntr_date,apt,floor,area,region_cd,rn_cd,rn_sn_cd,rn_bldg_mc,rn_bldg_sc)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

            result = await pool.execute(sql);
            // clog(result[0].affectedRows); // serverStatus: 2;
            if (Number.isInteger(result[0].affectedRows)) {
                clog({ result: `create table ${tableName}` });
            }
        } else {
            clog({ result: `table ${tableName} already exist` });
        }
    } catch (err) { errMessage(err, "table"); }
}

async function readItems(LAWD_CD, DEALYMD1, DEALYMD2, pageNo, numOfRows, filters) {

    let body
    if (numOfRows == 'all') {

        let sqlSelect = `SELECT
            FORMAT(ct.amount, 0) AS amount,
            CONCAT(ct.cnst_year) AS cnst_year,
            ct.cntr_date, ct.apt, ct.floor,
            CONCAT(ct.area) AS area,
            '${LAWD_CDList[LAWD_CD]}' as region_nm,
            CONCAT(ct.region_cd) AS region_cd,
            rn.road_nm, CONCAT(ct.rn_cd) AS rn_cd,
            ct.rn_sn_cd, ct.rn_bldg_mc, ct.rn_bldg_sc,
            dn.dong_nm, CONCAT(ct.dn_cd) AS dn_cd,
            ct.dn_mc, ct.dn_sc, ct.dn_ln_cd, ct.ln `;

        let sqlFrom = `FROM contracts${LAWD_CD} as ct
            INNER JOIN dong_names as dn
            ON ct.region_cd = dn.region_cd
            AND ct.dn_cd = dn.dn_cd
            LEFT OUTER JOIN road_names as rn
            ON ct.region_cd = rn.region_cd
            AND ct.rn_cd = rn.rn_cd `;

        let sqlWhere = `WHERE cntr_date BETWEEN '${DEALYMD1}' AND '${DEALYMD2}' `;

        let sqlVName = [];
        let sqlApt = [];
        let sqlArea = [];
        let sqlAmount = [];
        filters.forEach((v, i) => {
            if (v.type == 'v-name') {
                sqlVName.push(` dong_nm like '%${v.value}%' `);
                sqlVName.push(` road_nm like '%${v.value}%' `);
            } else if (v.type == 'apt') {
                sqlApt.push(` apt like '%${v.value}%' `);
            } else if (v.type == 'area') {
                let area = v.value.split(' ~ ');
                sqlArea.push(` area BETWEEN ${area[0]}-0.0001 AND ${area[1]}+0.0001 `);
            } else if (v.type == 'amount') {
                let amount = v.value.split(' ~ ');
                amount = amount.map(v => v.replace(/,/g, ""));
                sqlAmount.push(` amount BETWEEN '${amount[0]}' AND '${amount[1]}' `);
            }
        });
        if (sqlVName.length) sqlWhere += `AND (${sqlVName.join('OR')}) `;
        if (sqlApt.length) sqlWhere += `AND (${sqlApt.join('OR')}) `;
        if (sqlArea.length) sqlWhere += `AND (${sqlArea.join('OR')}) `;
        if (sqlAmount.length) sqlWhere += `AND (${sqlAmount.join('OR')}) `;
        // sqlWhere += `ORDER BY ct.dn_cd, ct.cntr_date, ct.area DESC
        // LIMIT ${(Number(pageNo) - 1) * Number(numOfRows)}, ${numOfRows}`;

        sqlWhere += `ORDER BY ct.cntr_date DESC, ct.dn_cd, ct.area DESC `;

        let sql = sqlSelect + sqlFrom + sqlWhere;
        let result = await sqlExecute(sql, [], 'cntr');
        let items = result[0];
        body = { numOfRows, pageNo, totalCount: items.length, items: { item: [] } };

        let keys = Object.keys(d2oKeys);
        let values = Object.values(d2oKeys);
        items.forEach(item => {
            let newItem = {};
            for (let i in keys) newItem[values[i]] = item[keys[i]];
            body.items.item.push(newItem);
        });

    } else {

        // get totalCount
        // ${DEAL_YMD.slice(0, -2)}-${DEAL_YMD.slice(-2)}-01
        let sqlSelect = `SELECT COUNT(*) as totalCount `;
        let sqlFrom = `FROM contracts${LAWD_CD} as ct
            INNER JOIN dong_names as dn
            ON ct.region_cd = dn.region_cd
            AND ct.dn_cd = dn.dn_cd
            LEFT OUTER JOIN road_names as rn
            ON ct.region_cd = rn.region_cd
            AND ct.rn_cd = rn.rn_cd `;
        let sqlWhere = `WHERE cntr_date BETWEEN '${DEALYMD1}' AND '${DEALYMD2}' `;

        let sqlVName = [];
        let sqlApt = [];
        let sqlArea = [];
        let sqlAmount = [];
        filters.forEach((v, i) => {
            if (v.type == 'v-name') {
                sqlVName.push(` dong_nm like '%${v.value}%' `);
                sqlVName.push(` road_nm like '%${v.value}%' `);
            } else if (v.type == 'apt') {
                sqlApt.push(` apt like '%${v.value}%' `);
            } else if (v.type == 'area') {
                let area = v.value.split(' ~ ');
                sqlArea.push(` area BETWEEN ${area[0]}-0.0001 AND ${area[1]}+0.0001 `);
            } else if (v.type == 'amount') {
                let amount = v.value.split(' ~ ');
                amount = amount.map(v => v.replace(/,/g, ""));
                sqlAmount.push(` amount BETWEEN '${amount[0]}' AND '${amount[1]}' `);
            }
        });
        if (sqlVName.length) sqlWhere += `AND (${sqlVName.join('OR')}) `;
        if (sqlApt.length) sqlWhere += `AND (${sqlApt.join('OR')}) `;
        if (sqlArea.length) sqlWhere += `AND (${sqlArea.join('OR')}) `;
        if (sqlAmount.length) sqlWhere += `AND (${sqlAmount.join('OR')}) `;
        // sqlWhere += `ORDER BY ct.dn_cd, ct.cntr_date, ct.area DESC
        // LIMIT ${(Number(pageNo) - 1) * Number(numOfRows)}, ${numOfRows}`;

        let sql = sqlSelect + sqlFrom + sqlWhere;
        // clog(sql);
        let result = await sqlExecute(sql, [], 'cntr');
        let { totalCount } = result[0][0];
        clog('totalCount', totalCount);

        // INNER JOIN road_names as rn : 483
        // LEFT OUTER JOIN road_names as rn : 487
        // let sql = `SELECT * FROM contracts${LAWD_CD} ORDER BY dn_cd`; // DESC
        // DATE_FORMAT(ct.cntr_date, '%Y') AS cntr_year,
        // DATE_FORMAT(ct.cntr_date, '%c') AS cntr_month,
        // DATE_FORMAT(ct.cntr_date, '%e') AS cntr_day,
        sqlSelect = `SELECT
            FORMAT(ct.amount, 0) AS amount,
            CONCAT(ct.cnst_year) AS cnst_year,
            ct.cntr_date, ct.apt, ct.floor,
            CONCAT(ct.area) AS area,
            '${LAWD_CDList[LAWD_CD]}' as region_nm,
            CONCAT(ct.region_cd) AS region_cd,
            rn.road_nm, CONCAT(ct.rn_cd) AS rn_cd,
            ct.rn_sn_cd, ct.rn_bldg_mc, ct.rn_bldg_sc,
            dn.dong_nm, CONCAT(ct.dn_cd) AS dn_cd,
            ct.dn_mc, ct.dn_sc, ct.dn_ln_cd, ct.ln `;

        sqlWhere += `ORDER BY ct.dn_cd, ct.cntr_date, ct.area DESC
        LIMIT ${(Number(pageNo) - 1) * Number(numOfRows)}, ${numOfRows}`;

        sql = sqlSelect + sqlFrom + sqlWhere;
        // clog(sql);
        result = await sqlExecute(sql, [], 'cntr');
        let items = result[0];
        clog(items.length);
        body = { numOfRows, pageNo, totalCount, items: { item: [] } };

        let keys = Object.keys(d2oKeys);
        let values = Object.values(d2oKeys);
        items.forEach(item => {
            let newItem = {};
            for (let i in keys) newItem[values[i]] = item[keys[i]];
            body.items.item.push(newItem);
        });
    }
    return body;
}

async function readOptions(LAWD_CD, DEALYMD1, DEALYMD2, opType) {
    let sqlSelect = "SELECT DISTINCT ";
    if (opType == 'v-name') sqlSelect += `dn.dong_nm as opt ` // rn.road_nm
    else if (opType == 'apt') sqlSelect += `ct.apt as opt `;
    else if (opType == 'area') sqlSelect += `CONCAT(ct.area) AS opt `;
    else if (opType == 'amount') sqlSelect += `FORMAT(ct.amount, 0) AS opt `;

    let sqlFrom = `FROM contracts${LAWD_CD} as ct
        INNER JOIN dong_names as dn
        ON ct.region_cd = dn.region_cd
        AND ct.dn_cd = dn.dn_cd
        LEFT OUTER JOIN road_names as rn
        ON ct.region_cd = rn.region_cd
        AND ct.rn_cd = rn.rn_cd `;

    let sqlWhere = `WHERE cntr_date BETWEEN '${DEALYMD1}' AND '${DEALYMD2}' ORDER BY `;
    if (opType == 'v-name') sqlWhere += `opt `; // dn.dong_nm, rn.road_nm
    else if (opType == 'apt') sqlWhere += `opt `;
    else if (opType == 'area') sqlWhere += `ct.area `;
    else if (opType == 'amount') sqlWhere += `ct.amount `;

    let sql = sqlSelect + sqlFrom + sqlWhere;
    // clog(sql);
    let options = [];
    let result = await sqlExecute(sql, [], 'cntr');
    if (result[0] instanceof Array) {
        result[0].forEach(v => options.push(v.opt));
    }
    return options;
}

function setSchedule() {
    let j = schedule.scheduleJob('0 1 * * *', async function () {
        let date = new Date(); // today
        clog("do job of schedule", date);

        date.setMonth(date.getMonth() + 1); // after 1 month
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let DEAL_YMD = `${date.getFullYear()}-${month}-01`;

        clog('delete DEAL_YMD', DEAL_YMD);
        let sql = "DELETE FROM queries WHERE DEAL_YMD=?";
        let sqlVals = [DEAL_YMD];
        let result = await sqlExecute(sql, sqlVals, "schedule");
        if (result) clog(result[0]);
    });
    return j;
}

module.exports = {
    pool, sqlAction, errMessage,
    sqlExecute, createTable, readItems,
    setSchedule, readOptions
};
