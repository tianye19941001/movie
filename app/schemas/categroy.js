var mongoose = require('mongoose')
var Schema = mongoose.Schema 
var ObjectId = Schema.Types.ObjectId

var CategroySchema = new mongoose.Schema({
	name: String,
	movies: [{
		type: ObjectId,
		ref: 'Movie'
	}],
	meta:{
		creatAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

CategroySchema.pre('save',function(next) {
	if(this.isNew){
		this.meta.creatAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})

CategroySchema.statics ={
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},findById: function(id,cb){
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}
module.exports = CategroySchema