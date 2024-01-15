var express = require("express");
var router = express.Router();
var db = require("../models/index");
const member = require("../models/member");
var Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
var AES = require('mysql-aes');
var bcrypt = require('bcryptjs');

/* GET home page. */

// router.get("/login", async (req, res) => res.render("login", { layout: true }));

router.get("/", async (req, res) =>
  res.render("login", { resultMsg: "", email: "", password: "", layout: true })
);

// router.get("/index", async (req, res, next) => {
//   res.render("index", { title: "login", layout: false });
// });

router.post("/", async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  let member = await db.Member.findOne({ where: { email } });

  //로그인 로직 구현
  resultMsg = "";

  if (member == null) {
    resultMsg = "이메일이 일치하지 않습니다.";
  } else {
    if (member.member_password == password) {
      res.redirect("/chat");
    } else {
      resultMsg = "비밀번호가 일치하지 않습니다.";
    }
  }

  if (resultMsg != "") {
    res.render("login", { resultMsg, email, password });
  }
});

router.get("/entry", async (req, res, next) => {
  res.render("entry");
});

router.post("/entry", async (req, res, next) => {
  let email = req.body.email;
  let name = req.body.name;
  let member_password = req.body.member_password;
  let confirm_member_password = req.body.confirm_member_password;
  let telephone = req.body.telephone;
  let birth_date = req.body.birth_date;
  let entry_type_code = req.body.entry_type_code;

  let member = {
    email,
    member_password,
    confirm_member_password,
    name,
    profile_img_path: 1,
    telephone,
    entry_type_code,
    use_state_code: 1,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 1,
  };

  let savedMember = await db.Member.create(member);

  res.redirect("/");
});

router.get("/find", async (req, res, next) => {
  res.render("find", { resultMsg: "", email: "" });
});

router.post("/find", async (req, res, next) => {
  let email = req.body.email;

  let findEmail = await db.Member.findOne({ where: { email } });

  resultMsg = "";

  if (findEmail === null) {
    resultMsg = "존재하지 않는 이메일입니다.";
    res.render("find", { resultMsg, email });
  } else {
    res.redirect("/");
  }
});

//암호찾기 재설정 페이지 -password-init- 부분 구현 라우팅 메소드, Backend로 처리
//http://localhost:3000/password-init?token=~
router.get("/password-init", async(req,res,next)=>{
  const token = req.query.token;

  try{
    var tokenData = await jwt.verify(token, process.env.JWT_SECRET);
    //decrypt된 json 데이터 전송
    res.render('password-init', {code:200, data:tokenData, resultMsg:"OK"});

  }catch(err){
    console.log("This address is unvalid.");
    res.redirect('/login.html');
  }
});

router.post("/password-init", async(req,res,next)=>{
  var email= req.body.email;
  var password= req.body.password;

  const member = await db.Member.findOne({where:{email:email}});
  member.member_password=await bcrypt.hash(password,12);
  await db.Member.update(member, {where:{email:email}});

  console.log("Password update complete");

  res.redirect('/login.html');
  // res.redirect('/');
});

module.exports = router;
