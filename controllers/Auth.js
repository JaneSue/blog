var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = app.db;

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/login-ajax', function(req, res, next) {
  res.json({body: req.body.url})
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

passport.use(new LocalStrategy(function(username, password, done) {
	//print([username, password, done], {pre: true});
  app.db.models.User.findOne({ username: username }, function(err, user) {
    if(err){
      return done(err);
    }
    if(!user) {
      return done(null, false, { message: '当前用户不存在！' });
    }
    bcrypt.compare(password, user.password, function(err, isValid) {
      if(err){
        return done(err);
      }
      if(!isValid) {
        return done(null, false, { message: '用户密码错误！' });
      }
      return done(null, user);
    });
  });	
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	db.models.User.findById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/register-ajax', function(req, res, next) {
	var flow = app.utils.flow(req, res);
	var usernameVailReg = /^[a-zA-Z0-9\-\_]+$/;
	// 参数验证
	flow.on('vaildate', function(){
		if(!req.body.username){
	  	flow.outcome.errors.push('用户名不能为空!');
	  }else if (!usernameVailReg.test(req.body.username)) {
      flow.outcome.errors.push('only use letters, numbers, \'-\', \'_\'');
    }
	  if(!req.body.password){
	  	flow.outcome.errors.push('密码不能为空!');
	  }
	  if(flow.hasErrors()){
	  	return flow.emit('response');
	  }
	  flow.emit('checkdb');
	});

	// 数据库验证
	flow.on('checkdb', function(){
		db.models.User.findOne({username: req.body.username}, function(err, user){
			if(err){
				return flow.emit('exception', err);
			}
			if (user) {
        flow.outcome.errors.push('用户名已存在!');
        return flow.emit('response');
      }
      flow.emit('createUser');
		})
	});

	flow.on('createUser', function(){
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password, salt, function(err, hash){
				if(err){
					return flow.emit('exception', err);
				}
				//print(hash, {pre: true});
				db.models.User.create({
					username: req.body.username,
					password: hash,
					roles: ['admin']
				}, function(err, user){
					flow.user = user;
					flow.emit('loginIn');
				})
			})
		})
	})

	flow.on('loginIn', function(){
		req._passport.instance.authenticate('local', function(err, user, info){
	  	if(err) {
	      return flow.emit('exception', err);
	    }
	    if(!user){
	    	flow.outcome.errors.push('登陆失败:' + info.message );
	      return flow.emit('response');
	    }
			req.login(user, function(){
				if (err) {
	        return flow.emit('exception', err);
	      }
	      flow.outcome.user = user;
	      flow.outcome.url = '/';
	      flow.emit('response');
			})
		})(req, res);
	})

	flow.emit('vaildate');
});

module.exports = router;