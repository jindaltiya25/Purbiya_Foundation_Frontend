// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     // service_URI:"mysql://avnadmin:AVNS_gJ5iyVv9Jm34heIdxmW@mysql-2e2d521d-suresh-c910.f.aivencloud.com:12859/defaultdb?ssl-mode=REQUIRED",
//     host: "mysql-2e2d521d-suresh-c910.f.aivencloud.com",
//     port: "12859",
//     user: "avnadmin",
//     password: "AVNS_gJ5iyVv9Jm34heIdxmW",
//     database: "defaultdb"
// });

// connection.connect((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("MySQL Connected");
//     }
// });

// module.exports = connection;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    // service_URI:"mysql://avnadmin:AVNS_gJ5iyVv9Jm34heIdxmW@mysql-2e2d521d-suresh-c910.f.aivencloud.com:12859/defaultdb?ssl-mode=REQUIRED",
    host: "mysql-2e2d521d-suresh-c910.f.aivencloud.com",
    port: "12859",
    user: "avnadmin",
    password: "AVNS_gJ5iyVv9Jm34heIdxmW",
    database: "defaultdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;