const mysql = require("mysql2/promise");
require("dotenv").config({ path: "./.env" });

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "myWellness",
});

module.exports = mysqlPool;