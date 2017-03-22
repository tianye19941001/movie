//index
var Movie = require('../models/movie')
var Categroy = require('../models/categroy')
exports.index = function(req,res){
	Categroy
		.find({})
		.populate({path:'movies',select: 'title poster',options:{limit:6 }})
		.exec(function(err,categroies){
			if (err) console.log(err)
			res.render('index',{
				title:'首页',
				categroies: categroies
			})
	})
}

exports.search = function(req,res){
	var catId = req.query.cat
	var page = parseInt(req.query.p, 10) || 0
	var q = req.query.q
	var count = 2 
	var index = page * count

	if (catId) {
		Categroy
			.find({_id:catId})
			.populate({
				path:'movies',
				select: 'title poster',
			})
			.exec(function(err,categroies){
				if (err) console.log(err)
				var categroy = categroies[0] || {}
				var movies = categroy.movies || []
				var results = movies.slice(index,index+count)
				res.render('results',{
					title:'结果列表页',
					keyword: categroy.name,
					currentPage: page+1,
					query: 'cat='+catId,
					totalPage: Math.ceil(movies.length/2), 
					movies: results
				})
			})
	}else{
		Movie
			.find({title: new RegExp(q+ '.*' , 'i') })
			.exec(function(err,movies){
				if (err) console.log(err)
				var results = movies.slice(index,index+count)
				res.render('results',{
					title:'结果列表页',
					keyword: q,
					currentPage: page+1,
					query: 'q='+q,
					totalPage: Math.ceil(movies.length/2), 
					movies: results
				})
			})
	}
}