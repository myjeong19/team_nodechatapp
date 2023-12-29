var express = require("express");
var router = express.Router();
var db = require("../models/index");
const member = require("../models/member");
var Op = db.Sequelize.Op;


/* GET home page. */


// router.get("/login", async (req, res) => res.render("login", { layout: true }));

router.get("/", async (req, res) => res.render("login", { layout: true }));

router.get("/index", async (req, res, next) => {
  res.render("index", { title: "login", layout: false });
});

router.post("/", async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  var member = await db.Member.findOne({where:{email,password}});

  // 로그인 구현 해야함

  
  console.log(`find /!! email : ${email}   password : ${password}`);

  res.redirect("/index");
});




router.get("/entry", async (req, res, next) => {
  res.render("entry");
});



router.post("/entry", async (req, res, next) => {
  let email = req.body.email;
  let member_password = req.body.password;
  let name = req.body.name;

  // console.log(`entry post!! email : ${email}   password : ${password}`);

  var member = {
    email,
    member_password,
    name,
    profile_img_path:1,
    telephone:"010-1111-1111",
    entry_type_code:1,
    use_state_code:1,
    birth_date:1,
    reg_date:1,
    reg_member_id:1
  };


  var savedMember = await db.Member.create(member);

  res.redirect("/");
});






router.get("/find", async (req, res, next) => {
  res.render("find", { title: "find" });
});

router.post("/find", async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`find post!! email : ${email}   password : ${password}`);

  res.redirect("/");
});
module.exports = router;
