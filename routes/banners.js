var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var banners = require('../models/banners');
var Seourls = require('../models/seourl');

// Register
router.get('/listbanners', function(req, res){
  res.render('banners/listbanners',{layout: false});
});
router.get('/addbanners', function(req, res){
  res.render('banners/addbanners',{layout: false});
});
router.get('/editbanners', function(req, res){
  res.render('banners/editbanners',{layout: false});
});
router.get('/getcountproducttypes', function(req, res){
  producttypes.Countproducttypes(function(err, producttypess){
      if(err) throw err;
      res.json({numofproducttypes:producttypess});
    });
});
router.get('/getallbanner', function(req, res){
  var page = req.param.page;
  banners.getAllbanners(page,per_page,function(err, producttypess){
      if(err) throw err;
      res.json(producttypess);
  });
});
router.get('/getbannerinfo', function(req, res){
  var id = req.param('id');
  banners.getbannersById(id, function(err, producttypess) {
      if(err) throw err;
      res.json(producttypess);
    });
});
router.post('/addbannersres', function(req, res){
  var create_date = new Date().getTime();
  var name = req.body.name;
  var image = req.body.image;
  var newbanner = new banners({
      image:'noimage.png',
      name: name,
      parent_name:req.body.parent_name,
      parent_id:req.body.parent_id,

  });
  if(image){
    var newbanner = new banners({
      image:image,
      name: name,
      parent_name:req.body.parent_name,
      parent_id:req.body.parent_id,
    });
  }
  banners.createbanners(newbanner, function(err, producttypess){
  });
  res.send('ok');
});
router.post('/editbannersres', function(req, res){
  var id = req.body.productdetailsid;
  var name = req.body.name;
  var image = req.body.image;
  var newbanner = {
      name:name,
      parent_name:req.body.parent_name,
      parent_id:req.body.parent_id,
  };
  if(image){
    var newbanner = {
      image:image,
      name:name,
      parent_name:req.body.parent_name,
      parent_id:req.body.parent_id,
    };
  }
  banners.editbanners(id,newbanner,function(err, newsps) {
  });
  
  //console.log(req.body); 
  res.send('ok');
});
router.post('/delbanners', function(req, res){
  var id = req.body.id;
    banners.delbanners(id, function(err, producttypess){
    });
    Seourls.delSeourl({content_id:id}, function(err, producttypess){
    });
    res.send('ok');
});
module.exports = router;
