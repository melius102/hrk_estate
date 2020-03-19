// https://github.com/mysqljs/mysql#connection-options
// const mysql = require('mysql2'); // normal version: mysql2/index.js
const mysql = require('mysql2/promise'); // promise version: mysql2/promise.js
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

module.exports = { pool, sqlAction };