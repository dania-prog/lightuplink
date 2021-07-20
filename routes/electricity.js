const express = require ("express");
const passport = require ("passport");
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router
	.get('/ikedc', function(req, res){
	res.render("ikedc");
	})
	.get('/ekedc', function(req, res){
	res.render("ekedc");
	})
	.get('/aedc', function(req, res){
	res.render("aedc");
	})
	.get('/kedco', function(req, res){
	res.render("kedco");
	})
	.get('/jedc', function(req, res){
	res.render("jedc");
	})
	.get('/ibedc', function(req, res){
	res.render("ibedc");
	})
	.get('/kaedco', function(req, res){
	res.render("kaedco");
	})
	.get('/phed', function(req, res){
	res.render("phed");
	})
	.get('/electricityBillConfirmation', function(req, res){
	let transactionId = uuidv4();
	let status = "initiated";
	res.render("electricityBillConfirmation",{status:status,transId:transactionId});
	});
module.exports = router;