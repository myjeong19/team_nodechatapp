const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('chat/index', { title: 'Express' });
});

module.exports = router;
