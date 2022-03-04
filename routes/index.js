var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser')


/* GET home page. */
router.get('/', function(req, res, next) {
  

  res.cookie('AuthToken', 'Test Cookie');
  
  res.render('index', { title: 'Express' });
});

const isValidUser = (req, res, next) => {
  const userJWT = true;

  if (userJWT === true) {
    next()
  } else {
    res.redirect('/users')
  }
}

router.get("/protected", isValidUser, (req, res, next) => {
  res.send("You are authorized")
})

module.exports = router;
