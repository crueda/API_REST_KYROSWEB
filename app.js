var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session		=	require('express-session');

var areas = require('./routes/areas');
var areasWeb = require('./routes/areasWeb');
var vertex = require('./routes/vertex');
var vertexWeb = require('./routes/vertexWeb');
var trackingWeb = require('./routes/trackingWeb');

//necesario para utilizar los verbos put y delete en formularios
var methodOverride = require('method-override');

var app = express();

//configuración para ejs
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'apidoc')));

var sess;

app.get('/',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.redirect('/admin');
	}
	else{
	res.render('indexWeb.html');
	}
});

app.post('/login',function(req,res){
	sess=req.session;
	sess.email=req.body.email;
	res.end('done');
});

app.get('/admin',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.write('<h1>Hello '+sess.email+'</h1><br>');
		res.end('<a href='+'/logout'+'>Logout</a>');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/'+'>Login</a>');
	}

});

app.get('/logout',function(req,res){

	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});


app.use('/webkyrosapi', areasWeb);
app.use('/webkyrosapi', vertexWeb);





// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
