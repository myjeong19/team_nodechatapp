var express = require('express');
var router = express.Router();

/* GET home page. */
var channel_list = [
  {
    channel_id: 1,
    community_id: 110011,
    category_code: 1021,
    channel_name: '채널1',
    user_limit: 100,
    channel_img_path: '채널1이미지',
    channel_desc: '채널1설명',
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 881,
    edit_date: Date.now(),
    edit_member_id: 991,
  },
  {
    channel_id: 2,
    community_id: 220022,
    category_code: 1022,
    channel_name: '채널2',
    user_limit: 200,
    channel_img_path: '채널2이미지',
    channel_desc: '채널2설명',
    channel_state_code: 0,
    reg_date: Date.now(),
    reg_member_id: 882,
    edit_date: Date.now(),
    edit_member_id: 992,
  },
  {
    channel_id: 3,
    community_id: 330033,
    category_code: 1023,
    channel_name: '채널3',
    user_limit: 300,
    channel_img_path: '채널3이미지',
    channel_desc: '채널3설명',
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 883,
    edit_date: Date.now(),
    edit_member_id: 993,
  },
];
var apiResult = {
  code: 200,
  data: [],
  result: 'OK',
};

router.get('/all', async (req, res, next) => {
  try {
    apiResult.code = 200;
    apiResult.data = channel_list;
    apiResult.result = 'OK';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

router.post('/create', async (req, res, next) => {
  try {
    var channel_id = req.body.channel_id;
    var community_id = req.body.community_id;
    var category_code = req.body.category_code;
    var channel_name = req.body.channel_name;
    var user_limit = req.body.user_limit;
    var channel_img_path = req.body.channel_img_path;
    var channel_desc = req.body.channel_desc;
    var channel_state_code = req.body.channel_state_code;
    var reg_member_id = req.body.reg_member_id;
    var edit_member_id = req.body.edit_member_id;

    var channel = {
      channel_id,
      community_id,
      category_code,
      channel_name,
      user_limit,
      channel_img_path,
      channel_desc,
      channel_state_code,
      reg_date: Date.now(),
      reg_member_id,
      edit_date: Date.now(),
      edit_member_id,
    };

    //
    var savedChannel = {
      channel_id: 1,
      community_id: 110011,
      category_code: 1021,
      channel_name: '채널1',
      user_limit: 100,
      channel_img_path: '채널1이미지',
      channel_desc: '채널1설명',
      channel_state_code: 1,
      reg_date: Date.now(),
      reg_member_id: 881,
      edit_date: Date.now(),
      edit_member_id: 991,
    };

    apiResult.code = 200;
    apiResult.data = savedChannel;
    apiResult.result = 'OK';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

router.post('/modify', async (req, res, next) => {
  try {
    var channel_id = req.body.channel_id;
    var community_id = req.body.community_id;
    var category_code = req.body.category_code;
    var channel_name = req.body.channel_name;
    var user_limit = req.body.user_limit;
    var channel_img_path = req.body.channel_img_path;
    var channel_desc = req.body.channel_desc;
    var channel_state_code = req.body.channel_state_code;
    var reg_member_id = req.body.reg_member_id;
    var edit_member_id = req.body.edit_member_id;

    var channel = {
      channel_id,
      community_id,
      category_code,
      channel_name,
      user_limit,
      channel_img_path,
      channel_desc,
      channel_state_code,
      reg_date: Date.now(),
      reg_member_id,
      edit_date: Date.now(),
      edit_member_id,
    };

    //
    var affectedCnt = 1;

    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = 'OK';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

router.post('/delete', async (req, res, next) => {
  try {
    var channel_id = req.body.channel_id;
    //삭제

    var affectedCnt = 1;

    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = 'OK';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

router.get('/:cid', async (req, res, next) => {
  try {
    var cid = req.params.cid;
    // console.log("cid : " + cid);

    //임시 Data
    var savedChannel = {
      channel_id: 3,
      community_id: 330033,
      category_code: 1023,
      channel_name: '채널3',
      user_limit: 300,
      channel_img_path: '채널3이미지',
      channel_desc: '채널3설명',
      channel_state_code: 1,
      reg_date: Date.now(),
      reg_member_id: 883,
      edit_date: Date.now(),
      edit_member_id: 993,
    };

    apiResult.code = 200;
    apiResult.data = savedChannel;
    apiResult.result = 'OK';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

module.exports = router;
