var express = require('express');
var mongoose = require("mongoose")
// User Schema
var NewsContentsSchema = mongoose.Schema({
	image:{
		type: String
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
	newscat_id:{
		type: String,
	},
	newscat_name:{
		type: String,
	},
	status:{
		type: Number,
	},
});
var NewsContents = module.exports = mongoose.model('newscontents', NewsContentsSchema);
module.exports.createNewsContents = function(newNewsContents, callback){
	newNewsContents.save(callback);
}
module.exports.editNewsContents = function(id,newNewsContents, callback){
	NewsContents.findByIdAndUpdate(id, newNewsContents,callback);
}
module.exports.findOneAndUpdateNewsContents = function(query,newNewsContents, callback){
	NewsContents.findOneAndUpdate(query, newNewsContents, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	NewsContents.getNewsContentsById(product_id,function(err, NewsContents) {
 		var Updateproduct = {count:NewsContents.count - pr_count};
 		NewsContents.editNewsContents(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	NewsContents.getNewsContentsById(product_id,function(err, NewsContents) {
 		var Updateproduct = {count:NewsContents.count + pr_count};
 		NewsContents.editNewsContents(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delNewsContents = function(id,callback){
	NewsContents.findByIdAndRemove(id, function(err, NewsContentss) {
  	if (err) throw err;
  		console.log(NewsContentss);
	});
}
module.exports.getNewsContentsById = function(id, callback){
	var query = {_id:id};
	NewsContents.findOne(query, callback);
}
module.exports.getAllNewsContents = function(page,per_page,callback){
	var query = {};
	NewsContents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getAllNewsContentsBycat = function(cat_id,page,per_page,callback){
	var query = {newscat_id:cat_id};
	NewsContents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.countNewsContentsByCat = function(callback){
	var query = {};
	NewsContents.count(query, callback);
}
module.exports.getAllNewsContentsBycatCount = function(cat_id,count,callback){
	var query = {newscat_id:cat_id};
	NewsContents.find(query, callback).skip(0).limit(count).sort({'create_date': -1 });
}
module.exports.countNewsContents = function(callback){
	var query = {};
	NewsContents.count(query, callback);
}

module.exports.getAllNewsContentsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	NewsContents.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'NewsContents_id': -1 });
}
module.exports.getNewsContentsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	NewsContents.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}