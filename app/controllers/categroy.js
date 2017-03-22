var Catetory = require('../models/categroy')

// admin
exports.new = function(req,res){
	res.render('categroy_admin',{
		title:'后台分类录入页',
		categroy: {}
	})
}
// admin post movie
exports.save = function(req,res){
	var _categroy = req.body.categroy
	var categroy = new Catetory(_categroy)

	categroy.save(function(err,categroy){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/categroy/list')
	})
}
exports.list = function(req,res){
	Catetory.fetch(function(err,categroies){
		if (err) {
			console.log(err)
		}
		res.render('categroylist',{
			title:'分类列表页',
			categroies:categroies
		})
	})
}
// list delete
exports.del = function(req,res){
	var id = req.query.id
	if(id){
		Catetory.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}
