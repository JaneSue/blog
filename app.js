var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var swig = require('swig');

var app = express();

//set swig no cached
swig.setDefaults({
  cache: false
});

// view engine setup
app.engine('swig', swig.renderFile);

app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'web')));

// 视图助手
app.use(function(req, res, next){
  res.locals.print = function(obj, config) {
    return util.inspect(obj, config || true);
  }
  next();
});

// 控制器
['site', 'users'].forEach(function(controllerName, i){
  var controller = require( './controllers/' + controllerName + 'Controller');
  if(controllerName == 'site'){
    controllerName = '';
  }
  app.use('/' + controllerName, controller)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/error');
});

app.listen(3000, function(){
  console.log('webapp listener port 3000!');
})

module.exports = app;
