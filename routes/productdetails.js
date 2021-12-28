var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var productdetails = require('../models/productdetails');

// Register
router.get('/listproductdetails', function(req, res){
	res.render('productdetails/listproductdetails',{layout: false});
});
router.get('/addproductdetails', function(req, res){
	res.render('productdetails/addproductdetails',{layout: false});
});
router.get('/editproductdetails', function(req, res){
	res.render('productdetails/editproductdetails',{layout: false});
});
router.get('/getcountproductdetails', function(req, res){
	productdetails.Countproductdetails(function(err, productdetailss){
			if(err) throw err;
			res.json({numofproductdetails:productdetailss});
		});
});
router.get('/getallproductdetails', function(req, res){
	var page = req.param.page;
	//var page = req.param('page','1');
	var userDetail = req.user.Detail;
	var userid = req.user._id;
	if(userDetail==1){
		productdetails.getAllProductsDetail(page,per_page,function(err, productdetailss){
			if(err) throw err;
			res.json(productdetailss);
		});
	}
	else{
		productdetails.getAllProductsDetail(page,per_page,function(err, productdetailss){
			if(err) throw err;
			res.json(productdetailss);
		});
	}
	
});
router.get('/getallproductdetailsnotpage', function(req, res){
	productdetails.getAllproductdetailsNotPage(function(err, productdetailss){
		if(err) throw err;
		res.json(productdetailss);
	});
});
router.get('/getproductdetailsinfo/:id', function(req, res){
	var id = req.params.id;
	productdetails.getProductsDetailById(id, function(err, productdetailss) {
    	if(err) throw err;
		res.json(productdetailss);
  	});
});


router.post('/addproductdetailsres', function(req, res){
	var name = req.body.name;
	var createuser = req.user._id;
	var newproductdetails = new productdetails({
			name: name
		});
		productdetails.createProductsDetail(newproductdetails, function(err, productdetailss){
			if(err) throw err;
			res.send('ok');
		});
});
router.post('/editproductdetailsres', function(req, res){
	var id = req.body.productdetailsid;
	var name = req.body.name;
	var editproductdetails = {
			name:name,
		};
	productdetails.editProductsDetail(id,editproductdetails,function(err, productdetailss) {
    	if(err) throw err;
		res.send('ok');
  	});
  	res.send('ok');
});
router.post('/dellproductdetailsres', function(req, res){
	var id = req.body.id;
  	productdetails.delproductdetails(id, function(err, productdetailss){
			if(err) throw err;
			res.send('ok');
		});
  	res.send('ok');
});
module.exports = router;
