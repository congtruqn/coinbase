var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var NewsCats = require('../models/newscats');
var Seourls = require('../models/seourl');

// Register
router.get('/listnewscats', function(req, res){
  res.render('newscats/listnewscats',{layout: false});
});
router.get('/addnewscats', function(req, res){
  res.render('newscats/addnewscats',{layout: false});
});
router.get('/editnewscats', function(req, res){
  res.render('newscats/editnewscats',{layout: false});
});
router.get('/getcountproducttypes', function(req, res){
  producttypes.Countproducttypes(function(err, producttypess){
      if(err) throw err;
      res.json({numofproducttypes:producttypess});
    });
});
router.get('/getallnewscats', function(req, res){
  var page = req.param.page;
  NewsCats.getAllNewsCats(page,per_page,function(err, producttypess){
      if(err) throw err;
      res.json(producttypess);
  });
});
router.get('/getallproducttypesnotpage', function(req, res){
  producttypes.getAllproducttypesNotPage(function(err, producttypess){
    if(err) throw err;
    res.json(producttypess);
  });
});
router.get('/getnewscatinfo', function(req, res){
  var id = req.param('id');
  NewsCats.getNewsCatsById(id, function(err, producttypess) {
      if(err) throw err;
      res.json(producttypess);
    });
});


router.post('/addnewscatsres', function(req, res){
  var create_date = new Date().getTime();
  var name = req.body.name;
  var desc = req.body.desc;
  var title = req.body.title;
  var keyword = req.body.keyword;
  var description = req.body.description;
  var content = req.body.content;
  var createuser = req.user._id;
  var createusername = req.user.name;
  var image = req.body.image;
  var seourl = req.body.seourl;
  
  var newNewsCat = new NewsCats({
      image:'noimage.png',
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
  });
  if(image){
    var newNewsCat = new NewsCats({
      image:image,
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
    });
  }

  NewsCats.createNewsCats(newNewsCat, function(err, producttypess){
    var detail ={
      lang:'vi',
      name: name,
      desc: desc,
      //content: content,
      title: title,
      keyword: keyword,
      description: description,
    }
    NewsCats.editNewsCats(producttypess._id,{$push:{detail:detail}},function(err, companys) {
              if(err) throw err;
    });
    var url =new Seourls({
      seo_url:seourl,
      content_id: producttypess._id,
      type: 2,
    });
    Seourls.createSeourl(url, function(err, producttypess){
    });
    
  });
  res.send('ok');
});
router.post('/editnewscatsres', function(req, res){
  var id = req.body.productdetailsid;
  var name = req.body.name;
  var desc = req.body.desc;
  var title = req.body.title;
  var keyword = req.body.keyword;
  var description = req.body.description;
  var content = req.body.content;
  var createuser = req.user._id;
  var createusername = req.user.name;
  var image = req.body.image;
  var seourl = req.body.seourl;
  var newNewsCat = {
      seo_url:seourl,
  };
  if(image){
    var newNewsCat = {
      image:image,
      seo_url:seourl,
    };
  }
  NewsCats.editNewsCats(id,newNewsCat,function(err, newsps) {
    if(err){

    }
    else{
      console.log(newsps);
      var detail1 ={
        name: name,
        desc: desc,
        content: content,
        title: title,
        keyword: keyword,
        description: description,
        lang:'vi'
      };
      NewsCats.findOneAndUpdateNewsCats({_id:newsps._id,"detail.lang":"vi"},{$set:{'detail.$':detail1}},function(err, details) {
              console.log(details);
      });
      Seourls.findOneAndUpdateSeourl({content_id:newsps._id},{seo_url:seourl}, function(err, producttypess){
      });
    }
    
  });
  
  //console.log(req.body); 
  res.send('ok');
});
router.post('/delnewcats', function(req, res){
  var id = req.body.id;
    NewsCats.delNewsCats(id, function(err, producttypess){
    });
    Seourls.delSeourl({content_id:id}, function(err, producttypess){
    });
    res.send('ok');
});
module.exports = router;
