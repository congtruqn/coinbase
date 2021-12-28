var express = require('express');
var app = express();
var mongoose = require("mongoose")
// User Schema
var productcatsSchema = mongoose.Schema({
	cat_id:{
		type: Number,
	},
	parent_id:{
		type: Number,
	},
	parent_name:{
		type: String,
	},
	image:{
		type: String,
	},
	detail:[{
		lang: String,
		name: String,
     	description: String,
     	content: String,
		title: String,
     	desc: String,
		keyword: String,
	}],
	status:{
		type: Number,
	},
	type:{
		type: Number,
	},
	create_date:{
		type: Number,
	},
	create_user:{
		type: String,
	},
	create_name:{
		type: String,
	},
	seo_url:{
		type: String,
	},
	child:{
		type: Number,
	},
	ishot:{
		type: Number,
	},
});
var productcats = module.exports = mongoose.model('productcats', productcatsSchema);
module.exports.createproductcats = function(newproductcats, callback){
	newproductcats.save(callback);
}
module.exports.editproductcats = function(id,newproductcats, callback){
	productcats.findByIdAndUpdate(id, newproductcats,callback);
}
module.exports.findOneAndUpdateproductcats = function(query,newproductcats, callback){
	productcats.findOneAndUpdate(query, newproductcats, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	productcats.getproductcatsById(product_id,function(err, productcats) {
 		var Updateproduct = {count:productcats.count - pr_count};
 		productcats.editproductcats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	productcats.getproductcatsById(product_id,function(err, productcats) {
 		var Updateproduct = {count:productcats.count + pr_count};
 		productcats.editproductcats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delproductcats = function(id,callback){
	productcats.findByIdAndRemove(id, function(err, productcatss) {
  	if (err) throw err;
  		console.log(productcatss);
	});
}
module.exports.getproductcatsById = function(id, callback){
	var query = {_id:id};
	productcats.findOne(query, callback);
}
module.exports.getAllproductcats = function(page,per_page,callback){
	var query = {};
	productcats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}

module.exports.countproductcats = function(callback){
	var query = {};
	productcats.count(query, callback);
}
module.exports.countMaxProductCatID = function(callback){
	var query = {};
	productcats.findOne(query,callback).sort({'cat_id': -1 });
}
module.exports.getMaxProductCatID =  function (callback) {
	productcats.countMaxProductCatID(function(err, productc) {
		//console.log(productc.cat_id);
		if(productc.cat_id){
			return callback(productc.cat_id);
		}
		else{
			return callback(1);
		}
  	});	
}
module.exports.getAllproductcatsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	productcats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'productcats_id': -1 });
}
module.exports.getproductcatsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	productcats.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}