const express = require ("express");
const passport = require ("passport");
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router
	.get('/airtelCredit', function(req, res){
	res.render("airtime/airtelCredit");
	})
	.get('/mtnCredit', function(req, res){
	res.render("airtime/mtnCredit");
	})
	.get('/gloCredit', function(req, res){
	res.render("airtime/gloCredit");
	})
	.get('/9mobileCredit', function(req, res){
	res.render("airtime/9mobileCredit");
	})
	.get('/airtimeConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("airtime/airtimeConfirmation", {status:status,transId:transactionId});
});

module.exports = router;