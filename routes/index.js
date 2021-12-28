var express = require('express');
var app = express();
var hb = require('express-handlebars').create();
var router = express.Router();
var per_page = 15;
/* GET home page. */
var newspages = require('../models/newspages');
var NewsContents = require('../models/newscontents');
var NewsCats = require('../models/newscats');
var Seourls = require('../models/seourl');
var banners = require('../models/banners');
var bannercats = require('../models/bannercats');
router.get('/', function(req, res, next) {
  //getAllNewsContentsBycatCount
  NewsContents.getAllNewsContentsBycatCount('5bb314a96f96090f587ac5f1',3,function(err, conten){
    res.render('content/index', {
        listnews:conten,
        title: 'Hóa đơn điện tử - Cty CP hóa đơn điện tử Vi Na',
        description: 'Cty CP hóa đơn điện tử Vi Na , cung cấp giải pháp hóa đơn điện tử toàn diện cho doanh nghiệp',
        layout: 'public',
    });
  });
});
router.get('/administrator/listproducts', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator', function(req, res, next) {
  if (!req.user) {
    res.render('user/login', { title: 'Login', layout: 'login' });
      //res.redirect('/user/login');
      //res.send({
        //Result: false,
        //Message: 'Chua dang nhap'
      //});
  } else {
      res.render('index', { title: 'Express' });
  }
});
router.post('/sentmail', function(req, res, next) {
  nodeMailer = require('nodemailer');
  var name = req.param('name');
  var email = req.param('email');
  var phone = req.param('phone');
  var taxcode = req.param('taxcode');
  var cont = 'Tên Khách hàng:'+name+'<br>-Email:'+email+'<br>-Điện thoại: '+phone+'<br>-MST: '+taxcode;
  let transporter = nodeMailer.createTransport({
          host: 'mail.smartvas.vn',
          port: 25,
          secure: false,
          auth: {
              user: 'mailtest@smartvas.vn',
              pass: '123456'
          }
  });
  let mailOptions = {
          from: '"Smartvas website" <mailtest@smartvas.vn>', // sender address
          to: "trinhpt@smartsign.com.vn", // list of receivers
          subject: "Khách hàng đăng ký", // Subject line
          text: cont, // plain text body
          html: cont, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              
  });
  res.send('1');
});
router.get('/administrator/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listuser/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/test', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listproducttypes/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listproducttypes', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listproductdetails/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listproductdetails', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/listorder/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/newspages', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/newspages/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/newscats', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/newscats/:page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/administrator/filemanager', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sales', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/lien-he', function(req, res, next) {
  res.render('content/contact', { title: 'Liên hệ - Cty CP hóa đơn điện tử Vi Na',layout: 'public' });
});
router.get('/hoa-don-mau', function(req, res, next) {
  banners.getallbannersnotpage(async function(err, conten){
    var bannercat = await getbannercats();
    console.log(bannercat);
    res.render('content/sampleinvoice', {
      samplein:conten,
      invoicetemplate:bannercat,
      title: 'Hóa đơn mẫu- Cty CP hóa đơn điện tử Vi Na',
      layout: 'public',
    });
  });
});
function getbannercats() {
    return new Promise((resolve, reject)=>{
        bannercats.getlistbannercats(async function (err, productcat) {
            console.log(productcat);
            var productcatdetail = JSON.parse(JSON.stringify(productcat));
            if (productcat) {
              for (var x in productcat) {
                var temp = await getbanners(productcat[x]._id);
                var productiteam = JSON.parse(JSON.stringify(temp));
                productcatdetail[x].product = productiteam;

              }
              resolve(productcatdetail);
            }
            else {
                reject('productcat null')
            }
        });
    });
}
function getbanners(cat_id) {
    return new Promise((resolve, reject)=>{
        banners.getallbannersbycats(cat_id,function(err, countproduct){
          if (countproduct) {
            resolve(countproduct);
          }
          else{
            eject('productcat null')
          }
        });
    });
}
router.get('/bang-gia', function(req, res, next) {
  res.render('content/price', { title: 'Bảng giá - Cty CP hóa đơn điện tử Vi Na',layout: 'public' });
});
function isMobile(req) {
    NewsContents.countNewsContentsByCat(function(err, conten){
       return conten;
  });
}
router.get('/:seourl',function(req, res, next) {
  var seourl = req.params.seourl;
  Seourls.findByUrl(seourl,function(err, producttypess){
    if(producttypess){
      if(producttypess.type==1){
        newspages.getNewsPagesById(producttypess.content_id,function(err, conten){
          console.log(conten);
          res.render('content/page', {
            contents:conten,
            details:conten.detail[0],
            title:conten.detail[0].title,
            layout: 'public'
          });
        });
        
      }
      if(producttypess.type==2){
        var page = req.param('page','1');
        NewsContents.countNewsContentsByCat(function(err, count){

          NewsCats.getnewscatsById(producttypess.content_id,function(err, newcatinfo){

              NewsContents.getAllNewsContentsBycat(producttypess.content_id,page,per_page,function(err, conten){
                var allpage = (count/per_page)+1;
                var arraypage = [];
                for (var i = 1; i <= allpage; i++ ) {
                    var temp ={
                      pagecount:i,
                      seo_url:newcatinfo.seo_url
                    }
                    arraypage.push(temp);
                };
                console.log(newcatinfo);
                res.render('content/newscat', {
                  contents:conten,
                  allpage:arraypage,
                  newscatinfo:newcatinfo,
                  newcatdetail:newcatinfo.detail[0],
                  //details:conten.detail[0],
                  title:'',
                  layout: 'public',
                });
              });

          });

        });
      }
      if(producttypess.type==3){
        NewsContents.getNewsContentsById(producttypess.content_id,function(err, conten){
          console.log(conten);
          res.render('content/newscontent', {
            contents:conten,
            details:conten.detail[0],
            title:conten.detail[0].title,
            layout: 'public'
          });
        });
        
      }
      else{
        //res.render('content/newscat', { title: 'Login', layout: 'public' });
      }
    }
    else{
      res.render('content/newscat', { title: 'Login', layout: 'public' });
    }

  });
  
});

module.exports = router;
