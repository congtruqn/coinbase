var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var producttypes = require('../models/producttypes');

// Register
router.get('/listproducttypes', function(req, res){
	res.render('producttypes/listproducttypes',{layout: false});
});
router.get('/addproducttypes', function(req, res){
	res.render('producttypes/addproducttypes',{layout: false});
});
router.get('/editproducttypes', function(req, res){
	res.render('producttypes/editproducttypes',{layout: false});
});
router.get('/getcountproducttypes', function(req, res){
	producttypes.Countproducttypes(function(err, producttypess){
			if(err) throw err;
			res.json({numofproducttypes:producttypess});
		});
});
router.get('/getallproducttypes', function(req, res){
	var page = req.param.page;
	//var page = req.param('page','1');
	var usertype = req.user.type;
	var userid = req.user._id;
	if(usertype==1){
		producttypes.getAllProductsType(page,per_page,function(err, producttypess){
			if(err) throw err;
			res.json(producttypess);
		});
	}
	else{
		producttypes.getAllProductsType(page,per_page,function(err, producttypess){
			if(err) throw err;
			res.json(producttypess);
		});
	}
	
});
router.get('/getallproducttypesnotpage', function(req, res){
	producttypes.getAllproducttypesNotPage(function(err, producttypess){
		if(err) throw err;
		res.json(producttypess);
	});
});
router.get('/getproducttypesinfo/:id', function(req, res){
	var id = req.params.id;
	producttypes.getProductsTypeById(id, function(err, producttypess) {
    	if(err) throw err;
		res.json(producttypess);
  	});
});


router.post('/addproducttypesres', function(req, res){
	var name = req.body.name;
	var createuser = req.user._id;
	var newproducttypes = new producttypes({
			name: name
		});
		producttypes.createProductsType(newproducttypes, function(err, producttypess){
			if(err) throw err;
			res.send('ok');
		});
});
router.post('/editproducttypesres', function(req, res){
	var id = req.body.producttypesid;
	var name = req.body.name;
	var editproducttypes = {
			name:name,
		};
	producttypes.editProductsType(id,editproducttypes,function(err, producttypess) {
    	if(err) throw err;
		res.send('ok');
  	});
  	res.send('ok');
});
router.post('/dellproducttypesres', function(req, res){
	var id = req.body.id;
  	producttypes.delproducttypes(id, function(err, producttypess){
			if(err) throw err;
			res.send('ok');
		});
  	res.send('ok');
});
module.exports = router;
