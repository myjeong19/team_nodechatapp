var express = require("express");
var router = express.Router();
var db = require("../models/index");
const member = require("../models/member");
var Op = db.Sequelize.Op;

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
module.exports = router;
