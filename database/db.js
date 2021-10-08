const mysql = require('mysql')

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"roxiler"

})

module.exports = connection