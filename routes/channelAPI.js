var express = require('express');
var router = express.Router();
const db = require('../models/index');
const bcrypt = require('bcryptjs');
const aes = require('mysql-aes');
const jwt = require('jsonwebtoken');

var db = require('../models/index');

var {tokenAuthChecking} = require('./apiMiddleware.js');

//각종 열거형 상수 참조하기 - 코드성 데이터
var constants = require('../common/enum.js');

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

//channel create api
//일대일 채팅방은 기존 코드값대로 socket.js에서 생성/entry하고 
//그룹 채팅방만 /api/channel/create 쪽에서 생성처리합니다.
router.post('/create', async (req, res, next) => {
  // 넘어오는 값
  // {
  //   owner : "그룹만드는사람email(암호화x)",
  //   group_name : "r그룹채팅방이름",
  //   group_image_path : "",
  //   member_list : ["email1", "email2"],
  // } 이메일은 암호화x 
  try {
    var member_list = req.body.member_list;
    var regMember = await jwt.verify(req.body.owner, process.env.JWT_SECRET);

    //채널 생성
    var channel = {
      community_id: 1, //기본값
      category_code: 2, //그룹채팅방
      channel_name: req.body.group_name,
      user_limit: 100, //기본값
      channel_img_path: req.body.group_image_path,
      channel_desc: `${channel_name} 채팅방 입니다.`, //기본 소개글로 설정 후 추후 수정
      channel_state_code: 0, //채팅방 생성 직후 비활성화 상태로 생성
      reg_date: Date.now(),
      reg_member_id: regMember.member_id,
    };
    var newChannel = await db.Channel.create(channel);

    //관리자(현재 접속 사용자) 채널 멤버 추가
    var channelRegMember = {
      channel_id: newChannel.channel_id,
      member_id: regMember.member_id,
      nick_name: regMember.name,
      member_type_code: 0, //참여자
      active_state_code: 0,
      last_contact_date: '',
      connection_id: '',
      ip_address: '',
      edit_date: Date.now(),
      edit_id: regMember.member_id
    }
    await db.ChannelMember.create(channelRegMember);

    //일반참여자(관리자가 add한 멤버) 채널 멤버 추가
    for (var i = 0; i < member_list.length; i++) {
      var email = await aes.encrypt(member_list[i], process.env.MYSQL_AES_KEY);
      var targetmember = await db.Member.findOne({
        where: { email: email },
        attributes: ['member_id', 'name', 'email']
      });
      var channelMember = {
        channel_id: newChannel.channel_id,
        member_id: targetmember.member_id,
        nick_name: targetmember.name,
        member_type_code: 0, //참여자
        active_state_code: 0,
        last_contact_date: '',
        connection_id: '',
        ip_address: '',
        edit_date: Date.now(),
        edit_id: regMember.member_id
      };
      await db.ChannelMember.create(channelMember);
    }

    apiResult.code = 200;
    apiResult.data = newChannel;
    apiResult.result = `${newChannel.channel_name} Created success`;
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Server Error in /api/channel/create POST';
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


//오영석
/*
-전체 그룹채널 목록 조회 API
-http://localhost:3000/api/channel/groupAll
*/
router.get('/groupAll',tokenAuthChecking, async (req, res) => {
  
  try {

    var channels = await db.Channel.findAll({
      attributes:['channel_id','comunity_id','channel_name','channel_img_path'],
      where:{channel_state_code:constants.CHANNEL_STATE_CODE_USED}
    });

    apiResult.code = 200;
    apiResult.data = channels;
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
