var express = require('express')
var path = require('path')
var session = require('express-session');
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan')
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser')
var dbUrl = 'mongodb://localhost/tianye'
mongoose.connect(dbUrl)

app.set('views','./app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(require('connect-multiparty')())
app.locals.moment = require('moment')
app.use(session({
	secret: 'tianye',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

if ('development' === app.get('env')) {
	app.set('showStackError',true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug',true)
}

require('./config/routes')(app)
// app.set(port)
app.listen(port)


console.log('started')