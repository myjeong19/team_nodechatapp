var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '사용자 웹페이지' });
});

// 로그인 웹페이지 요청 및 응답
router.get('/login', function (req, res, next) {
  res.render('login');
});

//로그인 처리 요청 및 응답,로그인 완료 후 채팅 페이지 이동처리
router.post('/login', function (req, res, next) {
  res.redirect('/chat');
});

//회원가입 웹페이지 요청 및 응답
router.get('/entry', function (req, res, next) {
  res.render('entry');
});

//회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
router.post('/entry', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var phone = req.body.phone;
  var birth = req.body.birth;

  var member = {
    email,
    password,
    name,
    phone,
    birth,
    entryDate: Date.now(),
  };

  res.redirect('/login');
});

//암호 찾기 웹페이지 요청 및 응답
router.get('/find', function (req, res, next) {
  res.render('find');
});

//암호찾기 처리 요청 및 응답,암호 찾기 완료 후 로그인 페이지 이동처리
router.post('/find', function (req, res, next) {
  var email = req.body.email;
  var name = req.body.name;
  var phone = req.body.phone;

  var member = {
    email,
    name,
    phone,
    findDate: Date.now(),
  };

  res.redirect('/login');
});

module.exports = router;
