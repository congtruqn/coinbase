var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var Products = require('../models/products');
var Stocks = require('../models/stocks');

var elastic = require('../models/elasticsearch');
// Register
router.get('/addproducts', function(req, res){
	res.render('products/addproducts',{layout: false});
});
router.get('/sales', function(req, res){
  res.render('products/sales',{layout: false});
});
router.get('/kill', function(req, res){
  Products.getProductsById(1, function(err, companys) {
      if(err) throw err;
    res.json(companys);
  });  
  res.render('products/sales',{layout: false});
});
router.get('/editproducts', function(req, res){
  res.render('products/editproducts',{layout: false});
});
router.get('/listproducts', function(req, res){
	res.render('products/listproducts',{layout: false});
});
router.get('/images', function(req, res){
  res.render('products/images',{layout: false});
});
router.get('/searchs', function(req, res){
  res.render('products/search',{layout: false});
});
router.post('/upload', multipartMiddleware,function(req, res) {
  fs.readFile(req.files.file.path, function (err, data) {
    var imageName = req.files.file.name
    // If there's an error
    if(!imageName){
      res.status(200).json({imagesname:0})
    } else {
      var newPath=__basedir+"/public/uploads/"+imageName;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.status(200).json({imagesname:imageName})
        //res.redirect("/public/uploads/" + imageName);
      });
    }
  });
});
router.post('/addproductres', function(req, res){
  var create_date = new Date().getTime();
  var createProduct = new Products({
      product_code: req.body.product_code,
      product_code_count:req.body.product_code_id,
      product_name: req.body.product_name,
      product_type_id:req.body.product_type_id,
      product_type_name: req.body.product_type_name,
      buy_price:req.body.buy_price,
      sell_price:req.body.sell_price,
      count:req.body.count,
      image_name:req.body.image_name
  });
  var product_detail_search ='';
  //console.log(createProduct);
  Products.createProducts(createProduct,function(err, companys) {
    for (var i in req.body.product_detail) {
      Products.editProducts(companys._id,{$push:{product_detail:req.body.product_detail[i]}},function(err, companys) {
            if(err) throw err;
      });
      //product_detail_search = product_detail_search + req.body.product_detail[i].detail_value + "  ";
    }
    product_detail_search = req.body.product_detail[0];
    var createStock = new Stocks({
      product_code: req.body.product_code,
      product_code_count:req.body.product_code_id,
      product_id:companys._id,
      product_name: req.body.product_name,
      product_type_id:req.body.product_type_id,
      product_type_name: req.body.product_type_name,
      buy_price:req.body.buy_price,
      sell_price:req.body.sell_price,
      count:req.body.count,
      image_name:req.body.image_name,
      create_date:create_date,
      import_stock_id:0,
    });
    Stocks.createStocks(createStock,function(err, stocks) {
      for (var i in req.body.product_detail) {
        Stocks.editStocks(stocks._id,{$push:{product_detail:req.body.product_detail[i]}},function(err, companys) {
            if(err) throw err;
          //res.send('ok');
        });
      }
      console.log(stocks._id); 
      var createSearch = {
        product_code: req.body.product_code,
        product_name: req.body.product_name,
        stockid:stocks._id,
        product_detail:product_detail_search,
        image_name:req.body.image_name,
        sell_price:req.body.sell_price
      };
      elastic.addDocument(createSearch).then(function (result) {
        //res.json(result);
        //console.log(result); 
      });
    });
  });
  res.send('ok');
});

router.post('/editproductsres', function(req, res){
  var editProduct = {
      //product_id:companys._id,
      product_name: req.body.product_name,
      product_type_id:req.body.product_type_id,
      product_type_name: req.body.product_type_name,
      sell_price:req.body.sell_price,
      count:req.body.count,
      image_name:req.body.image_name
  };
  if(req.body.image_name==undefined){
    var editProduct = {
      product_name: req.body.product_name,
      product_type_id:req.body.product_type_id,
      product_type_name: req.body.product_type_name,
      sell_price:req.body.sell_price,
      count:req.body.count,
    }; 
  }
  Products.editProducts(req.body.product_id,editProduct,function(err, companys) {
    for (var i in req.body.product_detail) {
      Products.findOneAndUpdateProducts({_id:companys._id,"product_detail._id":req.body.product_detail[i].detail_id},{$set:{'product_detail.$.detail_value':req.body.product_detail[i].detail_value}},function(err, details) {
          //console.log(details);
      });
    };
    Stocks.getAllStocksByProduct(companys._id,function(err, stocks) {
      for (var i in stocks) {
        var editStocks = {
          product_name: req.body.product_name,
          product_type_id:req.body.product_type_id,
          product_type_name: req.body.product_type_name,
          sell_price:req.body.sell_price,
          image_name:req.body.image_name
        };
        var createSearch = {
          product_code: req.body.product_code,
          product_name: req.body.product_name,
          stockid:stocks[i]._id,
          product_detail:req.body.product_detail[0],
          image_name:req.body.image_name,
          sell_price:req.body.sell_price
        };
        if(stocks[i].import_stock_id=='0'){
          editStocks = {
            product_name: req.body.product_name,
            product_type_id:req.body.product_type_id,
            product_type_name: req.body.product_type_name,
            sell_price:req.body.sell_price,
            count:req.body.count,
            image_name:req.body.image_name
          };
        }
        Stocks.editStocks(stocks[i]._id,editStocks,function(err, stocksedit) {
          console.log({_id:stocks[i]._id,"product_detail.detail_name":req.body.product_detail[i].detail_name});
          Stocks.getAllStocksByDetail({_id:stocks[i]._id,"product_detail.detail_name":req.body.product_detail[i].detail_name},function(err, stocks) {
              console.log(stocks);
          });
          Stocks.findOneAndUpdateStocks({_id:stocks[i]._id,"product_detail.detail_name":req.body.product_detail[i].detail_name},{$set:{'product_detail.$.detail_value':req.body.product_detail[i].detail_value}},function(err, details) {
            //console.log(details);
          });
        });
        elastic.deleteSearchs(stocks[i]._id).then(function (result) {
        //res.json(result);
        });

        elastic.addDocument(createSearch).then(function (result) {
          //res.json(result);
          //console.log(result); 
        });
      };
    });
  });
  res.send('ok');
});
router.get('/getcountproducts', function(req, res){
  Products.countProducts(function(err, companys){
    if(err) throw err;
    res.json({numofcompany:companys});
  });
});
router.get('/sumproductprice', function(req, res){
  Products.SumAllPrice(function(err, companys){
    console.log(companys);
  });
});

router.get('/indexsearch', function(req, res){
  Stocks.getAllProductsInStocks(function(err, products){
    for (var i in products) {
      var details = {
        detail_name:products[i].product_detail[0].detail_name,
        detail_value:products[i].product_detail[0].detail_value
      };
      
      console.log(details);
      var createSearch = {
        product_code:products[i].product_code,
        product_name:products[i].product_name,
        stockid:products[i]._id,
        product_detail:details,
        image_name:products[i].image_name,
        sell_price:products[i].sell_price
      };
      elastic.addDocument(createSearch).then(function (result) {
        //res.json(result);
        console.log(result); 
      });
    }
  });
  res.redirect('/');
});
router.get('/suggest/:input', function (req, res, next) {
 elastic.getSearchs(req.params.input).then(function (result) { res.json(result) });
});
router.get('/getproductsinfo/:id', function(req, res){
  var id = req.params.id;
  Products.getProductsById(id, function(err, companys) {
      if(err) throw err;
    res.json(companys);
    });
});
router.get('/getstocksinfo/:id', function(req, res){
  var id = req.params.id;
  Stocks.getStocksById(id, function(err, companys) {
      if(err) throw err;
    res.json(companys);
    });
});

router.get('/getallproducts', function(req, res){
  var page = req.param('page','1');
  var usertype = req.user.type;
  var userid = req.user._id;
  if(usertype==1||usertype==2){
    Products.getAllProducts(page,per_page,function(err, companys){
      if(err) throw err;
      res.json(companys);
    });
  }
  else{
    Products.getAllProductsByUser(userid,page,per_page,function(err, companys){
      if(err) throw err;
      res.json(companys);
    });
  }
});
router.post('/searchproduct', function(req, res){
  var query = req.body.keyword;
  console.log("/.*"+query+"*/");
   Stocks.Searchs("/"+query+"/",function(err, companys){
    res.send(companys);
   });
});
router.get('/getmaxproductcode', function(req, res){
  Products.countMaxProductCode(function(err, companys){
    if(companys){
      if(Number(companys.product_code_count)<9){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP00000'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      else if(Number(companys.product_code_count)<99&&Number(companys.product_code_count)>=9){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP0000'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      else if(Number(companys.product_code_count)<999&&Number(companys.product_code_count)>=99){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP000'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      else if(Number(companys.product_code_count)<9999&&Number(companys.product_code_count)>=999){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP00'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      else if(Number(companys.product_code_count)<99999&&Number(companys.product_code_count)>=9999){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP0'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      else if(Number(companys.product_code_count)<999999&&Number(companys.product_code_count)>=99999){
        var jsons = {
          maxordercode:companys.product_code_count,
          ordercode:'SP'+(Number(companys.product_code_count)+1),
        }
        res.json(jsons);
      }
      
    }
    else{
      var jsons = {
          maxordercode:0,
          ordercode:'SP000001',
        }
        res.json(jsons);
    } 
  });
});

module.exports = router;
