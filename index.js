var express = require('express');
var app = express();
var jade = require('jade');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session)





mongoose.connect('mongodb://localhost:27017/gittisbox',{
						useNewUrlParser: true,
						useUnifiedTopology: true
					});
	console.log("MongooseVersion: "+mongoose.version)
require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true})); // get information from html forms
app.use(bodyParser.json());


app.use('/js', express.static(__dirname + '/static/js/vendor'));
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/aufgaben', express.static(__dirname + '/static/aufgaben'));
app.use('/aufgabentypen', express.static(__dirname + '/static/js/aufgabentypen'));
app.use('/images', express.static(__dirname+ '/static/images'));
app.set('view engine', 'jade');

var store = new MongoDBStore({
	uri:'mongodb://localhost:27017/gittisbox',
	collection: 'mySessions'
	 });
store.on('connected', function(){
	store.client;
	});
store.on('error', function(error){
	assert.ifError(error);
	assert.ok(false);
	});


app.use(session({ secret: 'ilovescotchscotchyscotchscotch',  //session secret
						resave: 'true', //siehe manual express-session
						saveUninitialized: 'true',
						store:store	//siehe manual express-session
						 }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./router')(app, passport);

app.listen(8080, function(){
	console.log('Der Nodeserver lauscht auf port 8081')

});
