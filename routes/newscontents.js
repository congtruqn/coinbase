var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var NewsContents = require('../models/newscontents');
var Seourls = require('../models/seourl');

// Register
router.get('/listnewscontents', function(req, res){
  res.render('newscontents/listnewscontents',{layout: false});
});
router.get('/addnewscontents', function(req, res){
  res.render('newscontents/addnewscontents',{layout: false});
});
router.get('/editnewscontents', function(req, res){
  res.render('newscontents/editnewscontents',{layout: false});
});
router.get('/getcountproducttypes', function(req, res){
  producttypes.Countproducttypes(function(err, producttypess){
      if(err) throw err;
      res.json({numofproducttypes:producttypess});
    });
});
router.get('/getallnewscontent', function(req, res){
  var page = req.param.page;
  NewsContents.getAllNewsContents(page,per_page,function(err, producttypess){
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
router.get('/getnewscontentinfo', function(req, res){
  var id = req.param('id');
  NewsContents.getNewsContentsById(id, function(err, producttypess) {
      if(err) throw err;
      res.json(producttypess);
    });
});


router.post('/addnewscontentsres', function(req, res){
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
  var newscat_id =req.body.newscat_id;
  var newscat_name =req.body.newscat_name;
  var newNewsContent = new NewsContents({
      image:'noimage.png',
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
      newscat_id:newscat_id,
      newscat_name:newscat_name,
  });
  if(image){
    var newNewsContent = new NewsContents({
      image:image,
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
      newscat_id:newscat_id,
      newscat_name:newscat_name,
    });
  }

  NewsContents.createNewsContents(newNewsContent, function(err, producttypess){
    var detail ={
      lang:'vi',
      name: name,
      desc: desc,
      content: content,
      title: title,
      keyword: keyword,
      description: description,
    }
    NewsContents.editNewsContents(producttypess._id,{$push:{detail:detail}},function(err, companys) {
              if(err) throw err;
    });
    var url =new Seourls({
      seo_url:seourl,
      content_id: producttypess._id,
      type: 3,
    });
    Seourls.createSeourl(url, function(err, producttypess){
    });
    
  });
  res.send('ok');
});
router.post('/editnewscontentsres', function(req, res){
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
  var newscat_id =req.body.newscat_id;
  var newscat_name =req.body.newscat_name;
  var newNewsContent = {
      seo_url:seourl,
      newscat_id:newscat_id,
      newscat_name:newscat_name,
  };
  if(image){
    var newNewsContent = {
      image:image,
      seo_url:seourl,
      newscat_id:newscat_id,
      newscat_name:newscat_name,
    };
  }
  NewsContents.editNewsContents(id,newNewsContent,function(err, newsps) {
    if(err){

    }
    else{
      var detail1 ={
        name: name,
        desc: desc,
        content: content,
        title: title,
        keyword: keyword,
        description: description,
        lang:'vi'
      };
      NewsContents.findOneAndUpdateNewsContents({_id:newsps._id,"detail.lang":"vi"},{$set:{'detail.$':detail1}},function(err, details) {
              console.log(details);
      });
      Seourls.findOneAndUpdateSeourl({content_id:newsps._id},{seo_url:seourl}, function(err, producttypess){
      });
    }
    
  });
  
  //console.log(req.body); 
  res.send('ok');
});
router.post('/delnewscontent', function(req, res){
  var id = req.body.id;
    NewsContents.delNewsContents(id, function(err, producttypess){
    });
    Seourls.delSeourl({content_id:id}, function(err, producttypess){
    });
    res.send('ok');
});
module.exports = router;
