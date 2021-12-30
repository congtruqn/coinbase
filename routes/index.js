var express = require('express');
var app = express();
var router = express.Router();
/* GET home page. */
var newspages = require('../models/newspages');
router.get('/', function(req, res, next) {
  res.json({});
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

router.get('/bang-gia', function(req, res, next) {
  res.render('content/price', { title: 'Bảng giá - Cty CP hóa đơn điện tử Vi Na',layout: 'public' });
});
router.get('/getallproject', function(req, res){
  newspages.getallproject(function(err, producttypess){
      if(err) throw err;
      res.json(producttypess);
  });
});
router.get('/getproject/:url', function(req, res){
  var url = req.params.url;
  newspages.getprojectbyurl(url,function(err, producttypess){
      if(err) throw err;
      res.json(producttypess);
  });
});
module.exports = router;
