var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var Order = require('../models/orders');
var Order = require('../models/register');
router.get('/listreportall', function(req, res){
	res.render('reports/listreportall',{layout: false});
});
router.get('/filemanager', function(req, res){
	res.render('reports/filemanager',{layout: false});
});
router.get('/listreportuser', function(req, res){
	res.render('reports/listreportuser',{layout: false});
});
router.get('/orderreport', function(req, res){
	res.render('reports/orderreport',{layout: false});
});
module.exports = router;
