var mongoose = require("mongoose")
// User Schema
var newscatsSchema = mongoose.Schema({
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
var newscats = module.exports = mongoose.model('newscats', newscatsSchema);
module.exports.createnewscats = function(newnewscats, callback){
	newnewscats.save(callback);
}
module.exports.editnewscats = function(id,newnewscats, callback){
	newscats.findByIdAndUpdate(id, newnewscats,callback);
}
module.exports.findOneAndUpdatenewscats = function(query,newnewscats, callback){
	newscats.findOneAndUpdate(query, newnewscats, callback);
}
module.exports.updateProductCount = function(product_id,pr_count,callback){
	newscats.getnewscatsById(product_id,function(err, newscats) {
 		var Updateproduct = {count:newscats.count - pr_count};
 		newscats.editnewscats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.addProductCount = function(product_id,pr_count,callback){
	newscats.getnewscatsById(product_id,function(err, newscats) {
 		var Updateproduct = {count:newscats.count + pr_count};
 		newscats.editnewscats(product_id,Updateproduct,function(err, callback) {
		            if(err) throw err;
		});
  	
  	});
}
module.exports.delnewscats = function(id,callback){
	newscats.findByIdAndRemove(id, function(err, newscatss) {
  	if (err) throw err;
  		console.log(newscatss);
	});
}
module.exports.getnewscatsById = function(id, callback){
	var query = {_id:id};
	newscats.findOne(query, callback);
}
module.exports.getAllnewscats = function(page,per_page,callback){
	var query = {};
	newscats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'create_date': -1 });
}

module.exports.countnewscats = function(callback){
	var query = {};
	newscats.count(query, callback);
}

module.exports.getAllnewscatsByUser = function(userid,page,per_page,callback){
	var query = {create_user: userid};
	newscats.find(query, callback).skip(per_page * (page - 1)).limit(per_page).sort({'newscats_id': -1 });
}
module.exports.getnewscatsByDate = function(type,from_date,to_date,callback){
	var query = {};
	if(type===1||type===2||type===3){
		query = {status:type};
	}
	else{
		query = {};
	}
	newscats.find(query, callback).where("create_date").gte(from_date).lte(to_date);
}