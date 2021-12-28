var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var newspages = require('../models/newspages');
var Seourls = require('../models/seourl');

// Register
router.get('/listpages', function(req, res){
  res.render('newspages/listnewspages',{layout: false});
});
router.get('/addnewspages', function(req, res){
  res.render('newspages/addnewspages',{layout: false});
});
router.get('/editnewspages', function(req, res){
  res.render('newspages/editnewspages',{layout: false});
});
router.get('/getcountproducttypes', function(req, res){
  producttypes.Countproducttypes(function(err, producttypess){
      if(err) throw err;
      res.json({numofproducttypes:producttypess});
    });
});
router.get('/getallnewspage', function(req, res){
  var page = req.param.page;
  newspages.getAllNewsPages(page,per_page,function(err, producttypess){
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
router.get('/getnewspageinfo', function(req, res){
  var id = req.param('id');
  newspages.getNewsPagesById(id, function(err, producttypess) {
      if(err) throw err;
      res.json(producttypess);
    });
});


router.post('/addnewspagesres', function(req, res){
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
  
  var newnewspage = new newspages({
      image:'noimage.png',
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
  });
  if(image){
    var newnewspage = new newspages({
      image:image,
      create_user: createuser,
      create_name: createusername,
      create_date:create_date,
      seo_url:seourl,
    });
  }

  newspages.createNewsPages(newnewspage, function(err, producttypess){
    var detail ={
      lang:'vi',
      name: name,
      desc: desc,
      content: content,
      title: title,
      keyword: keyword,
      description: description,
    }
    newspages.editNewsPages(producttypess._id,{$push:{detail:detail}},function(err, companys) {
              if(err) throw err;
    });
    var url =new Seourls({
      seo_url:seourl,
      content_id: producttypess._id,
      type: 1,
    });
    Seourls.createSeourl(url, function(err, producttypess){
    });
    
  });
  res.send('ok');
});
router.post('/editnewspagesres', function(req, res){
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
  var newnewspage = {
      seo_url:seourl,
  };
  if(image){
    var newnewspage = {
      image:image,
      seo_url:seourl,
    };
  }
  newspages.editNewsPages(id,newnewspage,function(err, newsps) {
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
      newspages.findOneAndUpdateNewsPages({_id:newsps._id,"detail.lang":"vi"},{$set:{'detail.$':detail1}},function(err, details) {
              console.log(details);
      });
      Seourls.findOneAndUpdateSeourl({content_id:newsps._id},{seo_url:seourl}, function(err, producttypess){
      });
    }
    
  });
  
  //console.log(req.body); 
  res.send('ok');
});
router.post('/delnewpages', function(req, res){
  var id = req.body.id;
    newspages.delNewsPages(id, function(err, producttypess){
    });
    Seourls.delSeourl({content_id:id}, function(err, producttypess){
    });
    res.send('ok');
});
module.exports = router;
