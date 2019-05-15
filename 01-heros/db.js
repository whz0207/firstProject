//封装操作mysql的代码
const mysql = require('mysql');


exports.query = (sql, callback) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'heros'
    });

    connection.connect();
    // query 方法可以自动开启连接
    connection.query(sql, (err, result) => {
        if (err) return;
        callback(result);
    })
    // 只要不关nodejs 与 Mysql 的连接会一直存在，会大概存在 8 个小时
    connection.end();
}