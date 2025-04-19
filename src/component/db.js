// db.js - This should NOT be used directly from React components
// This file is only for server-side use in Node.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "srv1234.hstgr.io",
  user: "u520885762_esa",
  password: "Esa@123*#",
  database: "u520885762_esa",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;