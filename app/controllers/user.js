var User = require('../models/user')

exports.showSignup = function(req,res){
	res.render('signup',{
		title:'注册页面',
	})
}
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'登录页面',
	})
}
// signup
exports.signup = function(req,res){
	var _user = req.body.user
	User.findOne({name: _user.name}, function(err, user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect('/signin')
		}else{
			var user = new User(_user)
			user.save(function(err,user){
				if (err) {
					console.log(err)
				}
				res.redirect('/')
			})
		}
	}) 
	// req.param('user')
}

exports.signin = function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err , user){
		if (err) console.log(err)

		if (!user) return res.redirect('/signup')

		user.comparePassword(password,function(err,isMach){
			if(err) console.log(err)
			if(isMach){
				req.session.user = user
				return res.redirect('/')
			}else{
				return res.redirect('/signin')
				console.log('password is not matched')
			}
		})
	})
}

exports.logout = function(req,res){
	delete req.session.user
	// delete app.locals.user

	return res.redirect('/')
}

exports.list = function(req,res){
	var user = req.session.user
	User.fetch(function(err,users){
		if (err) {
			console.log(err)
		}
		res.render('userlist',{
			title:'列表页',
			users:users
		})
	})
}
exports.signinRequired = function(req,res,next){
	var user = req.session.user
	if (!user) {
		return res.redirect('/signin')
	}
	next()
}
exports.adminRequired = function(req,res,next){
	var user = req.session.user
	if (user.role<=10) {
		return res.redirect('/')
	}
	next()
}
// list delete
exports.del = function(req,res){
	var id = req.query.id
	if(id){
		User.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}