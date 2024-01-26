var express = require("express");
var router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");
const jwt = require("jsonwebtoken");
const constants = require("../common/enum");

/* GET home page. */
var channel_list = [
  {
    channel_id: 1,
    community_id: 110011,
    category_code: 1021,
    channel_name: "채널1",
    user_limit: 100,
    channel_img_path: "채널1이미지",
    channel_desc: "채널1설명",
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
    channel_name: "채널2",
    user_limit: 200,
    channel_img_path: "채널2이미지",
    channel_desc: "채널2설명",
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
    channel_name: "채널3",
    user_limit: 300,
    channel_img_path: "채널3이미지",
    channel_desc: "채널3설명",
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
  result: "OK",
};

router.get("/all", async (req, res, next) => {
  try {
    apiResult.code = 200;
    apiResult.data = channel_list;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

//channel create api
//일대일 채팅방은 기존 코드값대로 socket.js에서 생성/entry하고
//그룹 채팅방만 /api/channel/create 쪽에서 생성처리합니다.
router.post("/create", async (req, res, next) => {
  // 넘어오는 값
  // createGroupObject = {
  //   email: currentUser.email,
  //   member_id: currentUser.member_id,
  //   name: currentUser.name,
  //   group_name: groupName,
  //   group_image_path: "",
  //   member_list: addGroupList.join(", "),
  //   member_list_de: addGroupList_de.join(", "),
  // };
  //member_list에는 이메일이 암호화되서.
  //member_list_de는 개발용으로 확인하려고 암호화 안한 이메일 보내는 중
  //console.log("create body : ", req.body);

  try {
    var member_list = req.body.member_list;

    var token = req.headers.authorization.split("Bearer")[1].trim();
    var tokenData = await jwt.verify(token, process.env.JWT_SECRET);

    //var regMember = await jwt.verify(req.body.owner, process.env.JWT_SECRET);
    var regMember = tokenData;
    //채널 생성
    var channel = {
      community_id: 1, //기본값
      category_code: constants.CHANNEL_TYPE_GROUP, //그룹채팅방
      channel_name: req.body.group_name,
      user_limit: constants.CHANNEL_LIMIT_DEFAULT, //기본값
      channel_img_path: req.body.group_image_path,
      channel_desc: `${req.body.group_name} 채팅방 입니다.`, //기본 소개글로 설정 후 추후 수정
      channel_state_code: constants.CHANNEL_STATE_DEACTIVE, //채팅방 생성 직후 비활성화 상태로 생성
      reg_date: Date.now(),
      reg_member_id: req.body.member_id,
    };
    var findResult = await db.Channel.findOne({
      where: { channel_name: channel.channel_name },
    });
    if (findResult) {
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = "already channel_name in /api/channel/create POST";
      console.log("channel already exist ", channel.channel_name);
    } else {
      var newChannel = await db.Channel.create(channel);

      //관리자(현재 접속 사용자) 채널 멤버 추가
      var channelRegMember = {
        channel_id: newChannel.channel_id,
        member_id: req.body.member_id,
        nick_name: req.body.name,
        member_type_code: constants.MEMBER_TYPE_OWNER, //0 관리자 1 사용자
        active_state_code: constants.MEMBER_STATE_LOGIN_IN, // 0 아웃 1 접속중
        //방장은 일단 loginㅎ나 ㅅ아태
        last_contact_date: "",
        connection_id: "",
        ip_address: "",
        edit_date: Date.now(),
        edit_id: req.body.member_id,
      };

      await db.ChannelMember.create(channelRegMember);

      member_list = req.body.member_list.split(",");
      //console.log("member_list : ", member_list);
      //일반참여자(관리자가 add한 멤버) 채널 멤버 추가
      for (var i = 0; i < member_list.length; i++) {
        //var email = await aes.encrypt(member_list[i], process.env.MYSQL_AES_KEY);
        var email = member_list[i].trim();
        var targetmember = await db.Member.findOne({
          where: { email: email },
          attributes: ["member_id", "name", "email"],
        });
        var channelMember = {
          channel_id: newChannel.channel_id,
          member_id: targetmember.member_id,
          nick_name: targetmember.name,
          member_type_code: constants.MEMBER_TYPE_MEMBER, //0 관리자 1 사용자
          active_state_code: constants.MEMBER_STATE_LOGIN_IN, //0 아웃 1 로그인
          //일반 멤버는 지금 접속해있는지 아닌지 모름.
          //db검색해봐야 함.
          last_contact_date: "",
          connection_id: "",
          ip_address: "",
          edit_date: Date.now(),
          edit_id: req.body.member_id,
        };
        //console.log("channelMember : ", channelMember);
        await db.ChannelMember.create(channelMember);
      }

      apiResult.code = 200;
      apiResult.data = newChannel;
      apiResult.result = `${newChannel.channel_name} Created success`;
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Server Error in /api/channel/create POST";
    console.log("err", err);
  }

  res.json(apiResult);
});

router.post("/modify", async (req, res, next) => {
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
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

router.post("/delete", async (req, res, next) => {
  try {
    var channel_id = req.body.channel_id;
    //삭제

    var affectedCnt = 1;

    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

router.get("/:cid", async (req, res, next) => {
  try {
    var cid = req.params.cid;
    // console.log("cid : " + cid);

    //임시 Data
    var savedChannel = {
      channel_id: 3,
      community_id: 330033,
      category_code: 1023,
      channel_name: "채널3",
      user_limit: 300,
      channel_img_path: "채널3이미지",
      channel_desc: "채널3설명",
      channel_state_code: 1,
      reg_date: Date.now(),
      reg_member_id: 883,
      edit_date: Date.now(),
      edit_member_id: 993,
    };

    apiResult.code = 200;
    apiResult.data = savedChannel;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

module.exports = router;