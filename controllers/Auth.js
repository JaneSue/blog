var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/login-ajax', function(req, res, next) {
  res.json({body: req.body.url})
});

module.exports = router;