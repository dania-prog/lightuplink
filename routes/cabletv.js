const express = require ("express");
const passport = require ("passport");
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router
	.get('/dstv', function(req, res){
	res.render("cabletv/dstv");
	})
	.get('/gotv', function(req, res){
	res.render("cabletv/gotv");
	})
	.get('/startimes', function(req, res){
	res.render("cabletv/startimes");
	})
	.get('/tvSubConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("cabletv/tvSubConfirmation",{status:status,transId:transactionId});
});
module.exports = router;