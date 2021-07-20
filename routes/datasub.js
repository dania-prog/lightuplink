const express = require ("express");
const passport = require ("passport");
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router
	.get('/airtel', function(req, res){
	res.render("datasub/airtel");
	})
	.get('/9mobile', function(req, res){
	res.render("datasub/9mobile");
	})
	.get('/mtn', function(req, res){
	})
	.get('/glo', function(req, res){
	res.render("datasub/glo");
	})
	.get('/dataConfirmation/', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("datasub/dataConfirmation",{status:status,transId:transactionId});
	});

module.exports = router;