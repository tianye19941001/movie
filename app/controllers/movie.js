var Movie = require('../models/movie')
var Categroy = require('../models/categroy')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// movie
exports.detial = function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		Movie.update({_id:id},{$inc:{pv:1}},function(err){
			if (err) console.log(err)
		})
		if (err) {
			console.log(err)
		}
		Comment
			.find({movie: id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err, comments){
			if (err) {
				console.log(err)
			}
			res.render('detail',{
				title: movie.title,
				movie: movie,
				comments: comments
			})
		})
		
	})
}

	// admin
exports.new = function(req,res){
	Categroy.find({},function(err,categroies){
		res.render('admin',{
			title:'后台录入页',
			categroies:categroies,
			movie:{}
		})
	})
}
	//admin update
exports.update = function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			Categroy.find({},function(err,categroies){
				res.render('admin',{
					title:'后台更新页',
					movie: movie,
					categroies:categroies
				})
			})
		})
	}
}

exports.savePoster = function(req,res,next){
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname,'../../','public/upload/'+ poster)
			fs.writeFile(newPath,data,function(err){
				if (err) console.log(err)
					req.poster = poster
					next()
			})
		})
	}else{
		next()
	}
}



	// admin post movie
exports.save = function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(req.poster){
		movieObj.poster = req.poster
	}

	if(id){
		Movie.findById(id,function(err,movie){
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err,movie){
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/'+ movie._id)
			})
		})
	}else{
		_movie = new Movie(movieObj)
		var categroyId = _movie.categroy
		var categroyName = movieObj.categroyName
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			if (categroyId) {

				Categroy.findById(categroyId,function(err,categroy){
					
					categroy.movies.push(_movie._id)
					
					categroy.save(function(err,categroy){
						
					res.redirect('/movie/'+movie._id)
					})
				})
			}else if(categroyName){
				var categroy =new Categroy({
					name:categroyName,
					movies:[movie._id]
				})
				categroy.save(function(err,categroy){	
					movie.categroy = categroy._id
					movie.save(function(err,movie){
						res.redirect('/movie/'+movie._id)
					})
				})
			}
				
		})
			
	}
}

// list
exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err)
		}
		res.render('list',{
			title:'列表页',
			movies:movies
		})
	})
}

// list delete
exports.del = function(req,res){
	var id = req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}