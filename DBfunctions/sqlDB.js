var db = require('../db.js');
var config = require('../config');


var funcs = {};


funcs.findUserByEmail = function(email, callback) {
	var qry = 'SELECT * FROM users WHERE email = ?';

	db.get().query(qry, [email], function (err, rows) {
		return callback(err, rows);
	});
}


funcs.insertNewUser = function(name, email, password, callback) {
	var qry = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

	db.get().query(qry, [name, email, password], function (err, result) {
		return callback(err, result);
	});
}


funcs.findUserByUserid = function(userid, callback) {
	var qry = 'SELECT name FROM users WHERE userid = ?';

	db.get().query(qry, [userid], function (err, rows) {
		return callback(err, rows);
	});
}


module.exports = funcs;
