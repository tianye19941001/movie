var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')
var Categroy = require('../app/controllers/categroy')
var _ = require('underscore')

module.exports = function(app){
	// pre handle user
	app.use(function(req,res,next){
		var _user = req.session.user

		app.locals.user = _user
		
		next()
	})

	app.get('/',Index.index)
	
	app.post('/user/signup',User.signup)
	app.post('/user/signin',User.signin)
	app.get('/logout',User.logout)
	app.get('/signin',User.showSignin)
	app.get('/signup',User.showSignup)
	app.get('/userlist',User.signinRequired,User.adminRequired,User.list)

	app.get('/movie/:id',Movie.detial)
	app.get('/admin',User.signinRequired,User.adminRequired,Movie.new)
	app.get('/admin/:id',User.signinRequired,User.adminRequired,Movie.update)
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)
	app.get('/list',User.signinRequired,User.adminRequired,Movie.list)
	app.delete('/list',User.signinRequired,User.adminRequired,Movie.del)
	app.delete('/admin/categroy/list',User.signinRequired,User.adminRequired,Categroy.del)
	app.delete('/admin/userlist',User.signinRequired,User.adminRequired,User.del)

	app.post('/user/comment',User.signinRequired,Comment.save)

	app.get('/admin/categroy/new',User.signinRequired,User.adminRequired,Categroy.new)
	app.post('/admin/categroy',User.signinRequired,User.adminRequired,Categroy.save)
	app.get('/admin/categroy/list',User.signinRequired,User.adminRequired,Categroy.list)

	app.get('/results',Index.search)
}
