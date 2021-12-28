var mongoose = require('mongoose');
// User Schema
var bannersSchema = mongoose.Schema({
	image:{
		type: String
	},
	name:{
		type: String,
	},
	parent_id:{
		type: String,
	},
	parent_name:{
		type: String,
	},
});
var banners = module.exports = mongoose.model('banners', bannersSchema);
module.exports.createbanners = function(newbanners, callback){
	newbanners.save(callback);
}
module.exports.editbanners = function(id,newbanners, callback){
	banners.findByIdAndUpdate(id, newbanners,callback);
}
module.exports.findOneAndUpdatebanners = function(query,newbanners, callback){
	banners.findOneAndUpdate(query, newbanners, callback);
}
module.exports.delbanners = function(id,callback){
	banners.findByIdAndRemove(id, function(err, bannerss) {
  	if (err) throw err;
  		console.log(bannerss);
	});
}
module.exports.getbannersById = function(id, callback){
	var query = {_id:id};
	banners.findOne(query, callback);
}
module.exports.getAllbanners = function(page,per_page,callback){
	var query = {};
	banners.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}
module.exports.getallbannersnotpage = function(callback){
	var query = {};
	banners.find(query, callback);
}
module.exports.getallbannersbycats = function(parent,callback){
	var query = {parent_id:parent};
	banners.find(query, callback).skip(0).limit(24);
}
module.exports.countbanners = function(callback){
	var query = {};
	banners.count(query, callback);
}

module.exports.getAllbannersByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	banners.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'banners_id': -1 });
}
module.exports.getbannersByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	banners.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}