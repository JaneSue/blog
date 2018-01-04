var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var swig = require('swig');
var mongoose = require('mongoose');
var config =  require("./configs/main");
var fs = require('fs');

var app = global.app = express();


// mongoose 数据库
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  console.log('mongoose connection success!');
});

// models
var modelsPath = './models';
var isModelExists = fs.existsSync(modelsPath);
var models = [];
if(isModelExists){
  models = fs.readdirSync(modelsPath);
}
models.forEach(function(filePath, i){
  fileName = filePath.replace(/\.js$/, '');
  if(fileName === 'plugins') return;
  try{
    require( modelsPath + '/' + fileName)(app, mongoose);
  }catch(err){
    console.log(err)
  }
});

// views
swig.setDefaults({
  cache: false
});

app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');
app.engine('swig', swig.renderFile);
 

// middleware
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

// controllers
var controllersPath = './controllers';
var isControllerExists = fs.existsSync(controllersPath);
var controllers = [];
if(isControllerExists){
  controllers = fs.readdirSync(controllersPath);
}
controllers.forEach(function(filePath, i){
  fileName = filePath.replace(/\.js$/, '');
  var controller = require( controllersPath + '/' + fileName);
  if(fileName == 'Site'){
    fileName = '';
  }
  app.use('/' + fileName, controller)
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

app.listen(config.port, function(){
  console.log('webapp listener port '+ config.port +'!');
})

module.exports = app;