const mysql = require('mysql2')

module.exports = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'susan.pant7',
    database:'real_state'
})