var express = require('express');
var router = express.Router();
var db = require('../DBfunctions/sqlDB.js');
var jwt = require('../DBfunctions/token.js');


router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	if(name == "")
		return res.json({ "status": "failed", "message": "Please enter your name!"});
	if(email == "")
		return res.json({ "status": "failed", "message": "Please enter a valid email address!"});
	if(password == "")
		return res.json({ "status": "failed", "message": "Please enter password!"});

	db.findUserByEmail(email, function (err, rows) {
	    if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!" });
	    }

	    if(rows.length != 0)
    		return res.json({ "status": "failed", "message": "Email already registered!" });

    	db.insertNewUser(name, email, password, function (err, result) {
    		if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error!" });
		    }
		    
			return res.json({ "status": "success", "message": "Registration Successful!" });
    	});
	});
});


router.post('/login', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if(email == "")
		return res.json({ "status": "failed", "message": "Please enter a valid email address!"});
	if(password == "")
		return res.json({ "status": "failed", "message": "Please enter password!"});

	db.findUserByEmail(email, function (err, rows) {
	    if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!" });
	    }

	    if(rows.length == 0)
    		return res.json({ "status": "failed", "message": "Unregistered Email!" });

		if(rows[0].password != password)
			return res.json({ "status": "failed", "message": "Invalid Password!" });

		var data = {
			"email" : email,
			"name": rows[0].name,
			"token": jwt.createToken(rows[0].userid)
		};

		return res.json({ "status": "success", "message": "success", "data": data });
	});
});


router.post('/welcome', function(req, res, next) {
	var token = req.body.token;
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });
		}

		var userid = result;

		db.findUserByUserid(userid, function (err, rows) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(rows.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "403" });		    

		    var data = {};
		    data.name = rows[0].name;

			return res.json({ "status": "success", "message": "ok", "code": "200", "data": data });
		});
	});
});


module.exports = router;
