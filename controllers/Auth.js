var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = app.db;

var article = {
	title: String,
	cover: String,
	created: Date,
	updated: Date,
	content: String,
	_id: Object,
	status:  Number,
	sort_by: Number,
	create_by: Object,
	category: [{
		type: String,
		default: '默认',
		max: 99
	}]
};

// 登录策略函数
passport.use(new LocalStrategy(function(username, password, done) {
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

// session序列化
passport.serializeUser(function(user, done) {
	done(null, user);
});

// session反序列化
passport.deserializeUser(function(user, done) {
	db.models.User.findById(user._id, function(err, user) {
    done(err, user);
  });
});

// 登录页面
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

// 登录验证
router.post('/login-ajax', function(req, res, next) {
  var flow = app.utils.flow(req, res);
	var usernameVailReg = /^[a-zA-Z0-9\-\_]+$/;
	if(req.isAuthenticated()){
		flow.outcome.errors.push('您已经登录!');
		return flow.emit('response');
	}
	// 参数验证
	flow.on('vaildate', function(){
		if(!req.body.username){
	  	flow.outcome.errors.push('用户名不能为空!');
	  }else if (!usernameVailReg.test(req.body.username)) {
      flow.outcome.errors.push('用户名不能使用除英文，数字以及\'-\', \'_\'以外的值！');
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
			bcrypt.compare(req.body.password, user.password, function(err, isValid){
				if(err){
					return flow.emit('exception', err);
				}
				if(!isValid){
					flow.outcome.errors.push('用户密码错误！');
					return flow.emit('response');
				}
			})
      flow.emit('loginIn');
		})
	});

	// 验证通过登录并写入session
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

// 注册页面
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

// 退出登录
router.get('/logout', function(req, res, next) {
	var url = '/';
	var redirect;
	if(redirect = req.query.redirect){
		url = redirect;
	}
  req.logout();
  return res.redirect(url);
});

// 注册验证
router.post('/register-ajax', function(req, res, next) {
	var flow = app.utils.flow(req, res);
	var usernameVailReg = /^[a-zA-Z0-9\-\_]+$/;
	// 参数验证
	flow.on('vaildate', function(){
		if(!req.body.username){
	  	flow.outcome.errors.push('用户名不能为空!');
	  }else if (!usernameVailReg.test(req.body.username)) {
      flow.outcome.errors.push('用户名不能使用除英文，数字以及\'-\', \'_\'以外的值！');
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
					if(err){
						return flow.emit('exception', err);
					}
					if(!user){
						flow.outcome.errors.push('注册失败: 数据库错误！');
	      		return flow.emit('response');
					}
					flow.user = user;
					flow.emit('loginIn');
				})
			})
		})
	});

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
	});

	flow.emit('vaildate');
});

module.exports = router;