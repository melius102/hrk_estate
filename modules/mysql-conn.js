// https://github.com/mysqljs/mysql#connection-options
// const mysql = require('mysql2'); // normal version: mysql2/index.js
const mysql = require('mysql2/promise'); // promise version: mysql2/promise.js
const { clog } = require('./util');

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

const dbErrnoList = [1062];
const noDisplayErrnoList = [1062];

function errMessage(err, title, index = null) {
    if (noDisplayErrnoList.includes(err.errno)) {
    } else if (dbErrnoList.includes(err.errno)) {
        clog(`err(${title}): ${err.code}(${err.errno}) ${err.sqlMessage}`);
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
                clog({ result: 'create table' });
            }
        } else {
            clog({ result: 'table already exist' });
        }
    } catch (err) { errMessage(err, "table"); }
}

module.exports = { pool, sqlAction, errMessage, sqlExecute, createTable };