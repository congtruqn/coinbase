var mongoose = require("mongoose")
// User Schema
var bannercatsSchema = mongoose.Schema({
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
});
var bannercats = module.exports = mongoose.model('bannercats', bannercatsSchema);
module.exports.createbannercats = function(newbannercats, callback){
	newbannercats.save(callback);
}
module.exports.editbannercats = function(id,newbannercats, callback){
	bannercats.findByIdAndUpdate(id, newbannercats,callback);
}
module.exports.findOneAndUpdatebannercats = function(query,newbannercats, callback){
	bannercats.findOneAndUpdate(query, newbannercats, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	bannercats.getbannercatsById(product_id,function(err, bannercats) {
 		var Updateproduct = {count:bannercats.count - pr_count};
 		bannercats.editbannercats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	bannercats.getbannercatsById(product_id,function(err, bannercats) {
 		var Updateproduct = {count:bannercats.count + pr_count};
 		bannercats.editbannercats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delbannercats = function(id,callback){
	bannercats.findByIdAndRemove(id, function(err, bannercatss) {
  	if (err) throw err;
  		console.log(bannercatss);
	});
}
module.exports.getbannercatsById = function(id, callback){
	var query = {_id:id};
	bannercats.findOne(query, callback);
}
module.exports.getAllbannercats = function(page,per_page,callback){
	var query = {};
	bannercats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getlistbannercats = function(callback){
	var query = {};
	bannercats.find(query, callback);
}
module.exports.countbannercats = function(callback){
	var query = {};
	bannercats.count(query, callback);
}

module.exports.getAllbannercatsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	bannercats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'bannercats_id': -1 });
}
module.exports.getbannercatsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	bannercats.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}