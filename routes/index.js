var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => res.render("login", { layout: true }));
router.get("/login", async (req, res) => res.render("login", { layout: true }));

router.get("/index", function (req, res, next) {
  res.render("index", { title: "login", layout: false });
});

router.post("/", function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`find /!! email : ${email}   password : ${password}`);

  res.redirect("/index");
});

router.get("/entry", function (req, res, next) {
  res.render("entry", { title: "entry" });
});

router.post("/entry", function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`entry post!! email : ${email}   password : ${password}`);

  res.redirect("/");
});

router.get("/find", function (req, res, next) {
  res.render("find", { title: "find" });
});

router.post("/find", function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`find post!! email : ${email}   password : ${password}`);

  res.redirect("/");
});
module.exports = router;
