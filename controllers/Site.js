var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	// var user = {
	// 	username: 'jane',
	// 	phone: '15521196787'
	// }
	// req.session.user = user;
	
	print(req.session, { pre: true });
	//req.session.destroy();
	return;
  res.render('site/index', { 
  	title: 'Express', 
  	data: {
  		'name': 'jane',
  		'age': 22,
  		'sex': 'boy'
  	}
  }); 
});

module.exports = router;
