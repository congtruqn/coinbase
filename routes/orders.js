var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 20;
var Order = require('../models/orders');
var ProductsOrder = require('../models/productsorder');
var User = require('../models/register');
var Stocks = require('../models/stocks');
var Products = require('../models/products');
// Register
router.get('/listorder', function(req, res){
	res.render('orders/listorder',{layout: false});
});
router.get('/getcountorderbydate', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		Order.countOrdersByDate(Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json({numofcompany:companys});
			//console.log(companys);
		});
	}
	else{
		//res.json({numofcompany:0});

	}

});
router.get('/getcountproductsorderbydate', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		ProductsOrder.countProductsOrdersByDate(Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json({numofcompany:companys});
			//console.log(companys);
		});
	}
	else{
		//res.json({numofcompany:0});

	}

});
router.post('/addorderres', function(req, res){
	var create_date = new Date().getTime();
	Order.getOrderCode(function(companys){
		var createOrder = new Order({
			order_code:companys.ordercode,
			order_id:(companys.maxordercode+1),
	      	total_monney: req.body.info.total_monney,
	      	customer_phone:req.body.info.customer_phone,
	      	customer_name: req.body.info.customer_name,
	      	saleoff_monney:req.body.info.saleoff_monney,
	      	buy_monney:req.body.info.buy_monney,
	      	create_date:create_date,
		});
		Order.createOrders(createOrder, function(err, orderinfo){
			for (var i in req.body.product) {
				var createProductsOrder = new ProductsOrder({
					order_id:orderinfo._id,
			      	product_code: req.body.product[i].product_code,
			      	product_id:req.body.product[i].product_id,
			      	product_name: req.body.product[i].product_name,
			      	product_type_id:req.body.product[i].product_type_id,
			      	product_type_name:req.body.product[i].product_type_name,
			      	buy_price:req.body.product[i].buy_price,
			      	sell_price:req.body.product[i].sell_price,
			      	count:req.body.product[i].order_count,
			      	image_name:req.body.product[i].image_name,
			      	create_date:create_date,
			      	import_stock_id:0,
			      	stock_id:req.body.product[i]._id,
				});
				var product_info = req.body.product[i];
				var productdetail = req.body.product[i].product_detail;
				//console.log(productdetail);
				ProductsOrder.createProductsorders(createProductsOrder,productdetail, function(err, producttypess){

				});
				var editStocks = {
		          count:(req.body.product[i].count-req.body.product[i].order_count),
		        };
		        Products.updateProductCount(req.body.product[i].product_id,req.body.product[i].order_count, function(err, productinfo) {

		        });
				Stocks.editStocks(req.body.product[i]._id,editStocks,function(err, stocksedit) {
					
				});
			}
		});
	});
	res.status(200).send('ok');
	//console.log(req.body);
});
router.post('/returnorder', function(req, res){
	var order_id = req.body.id;
	ProductsOrder.getAllProductByOrder(order_id,function(err, products){
		for (var i in products) {

			Products.addProductCount(products[i].product_id,products[i].count, function(err, productinfo) {

		    });
		    Stocks.addStocksCount(products[i].stock_id,products[i].count, function(err, productinfo) {

		    });
			ProductsOrder.delProductsorders(products[i]._id,function(err, products){
			});
		}
		Order.delOrders(order_id,function(err, products){

		});
		res.status(200).send('ok');
		
	});
});
router.get('/getallorder', function(req, res){
	var page = req.param('page','1');
	var usertype = req.user.type;
	var userid = req.user._id;
	if(usertype==1||usertype==2){
		Order.getAllOrder(page,per_page,function(err, companys){
			if(err) throw err;
			res.json(companys);
		});
	}
	else{
		Order.getAllOrderByUser(userid,page,per_page,function(err, companys){
			if(err) throw err;
			res.json(companys);
		});
	}
});
router.get('/getorderinfo/:id', function(req, res){
	var id = req.params.id;
	Order.getOrderById(id, function(err, companys) {
    	if(err) throw err;
		res.json(companys);
  	});
});
router.get('/editorder', function(req, res){
	res.render('orders/editorder',{layout: false});
});
router.get('/processorder', function(req, res){
	res.render('orders/processorder',{layout: false});
});
router.get('/vieworder', function(req, res){
	res.render('orders/vieworder',{layout: false});
});
router.get('/finishorder', function(req, res){
	res.render('orders/finishorder',{layout: false});
});
router.get('/editorder', function(req, res){
	res.render('orders/editorder',{layout: false});
});
router.get('/getallreport', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	var page = req.param('page','1');
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		ProductsOrder.getProductsOrdersByDate(page,per_page,Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json(companys);
		});
	}
	else{
		res.json({});
	}
});
router.get('/getsumallprofit', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		Order.SumTotalMonney(Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json(companys[0]);
		});
	}
	else{
		res.json({});
	}
});
router.get('/getallorderbydate', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	var page = req.param('page','1');
	var reporttype = 0;
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		Order.getOrdersByDate(page,per_page,Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json(companys);
		});
	}
	else{
		res.json({});
	}
});
router.get('/getuserreport', function(req, res){
	var fromdate = req.param('fromdate');
	var todate = req.param('todate');
	var user_id = req.param('user_id');
	var reporttype = req.param('type');
	if(fromdate!==null&&todate!==null&&fromdate!=='undefined'&&todate!=='undefined'&&user_id!=='undefined'&&user_id!==null){
		var temp1 = fromdate.split("/");
		var fromdate1 = new Date(Date.UTC(temp1[2],temp1[1]-1,temp1[0])).getTime();
		var temp2 = todate.split("/");
		var todate1  = new Date(Date.UTC(temp2[2],temp2[1]-1,temp2[0],12,59,59)).getTime();
		Order.getOrderByUserDate(user_id,Number(reporttype),Number(fromdate1),Number(todate1),function(err, companys){
			if(err) throw err;
			res.json(companys);
		});
	}
	else{
		res.json({});
	}
	
});
module.exports = router;
