var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');


var app = express();
var index = require('./routes/index');
var filemanager = require('./routes/filemanager');
var users = require('./routes/users');
var products = require('./routes/products');
var productdetails = require('./routes/productdetails');
var register = require('./routes/register');
var orders = require('./routes/orders');
var producttypes = require('./routes/producttypes');
var report = require('./routes/report');
var newscats = require('./routes/newscats');
var newspages = require('./routes/newspages');
var newscats = require('./routes/newscats');
var bannercats = require('./routes/bannercats');
var newscontents = require('./routes/newscontents');
var banners = require('./routes/banners');
global.__basedir = __dirname;
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());



// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(require('request-param')({ order: ["body","params","query"] } ) );
// Connect Flash
app.use(flash());
// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
app.use('/', index);
app.use('/user', users);
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const options = {
  user:"coinbase",
  pass:"Tru205649601@",
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true
};
var db = mongoose.connect("mongodb://210.211.108.228/coinbase",options);
app.use(function (req, res, next) {
    if (!req.user) {
      res.render('user/login', { title: 'Login', layout: 'login' });
    } else {
        next();
    }
});
app.use('/newscats', newscats);
app.use('/products', products);
app.use('/filemanager', filemanager);
app.use('/productdetails', productdetails);
app.use('/register', register);
app.use('/orders', orders);
app.use('/producttypes', producttypes);
app.use('/report', report);
app.use('/newscats', newscats);
app.use('/newspages', newspages);
app.use('/newscontents', newscontents);
app.use('/banners', banners);
app.use('/bannercats', bannercats);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
