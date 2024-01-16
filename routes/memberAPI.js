let express = require('express');
let router = express.Router();
const path = require('path');
const app = express();
let db = require('../models/index');
let Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const aes = require('mysql-aes');
var jwt = require('jsonwebtoken');

const { mergeByKey, apiResultSetFunc } = require('./utils/utiles');
const { tokenAuthChecking } = require('./apiMiddleware');

//login api
//에러처리
//1. http://locatlhost:3000/api/member/login/1 -> 정의되지 않은 라우터경로 처리
//2. http://localhost:3000/api/member/login "email" : "hwoarang09@naver.com11" 이메일이 db에없는 경우
// {
//   "success": false,
//   "message": "No member"
// }
//3. http://localhost:3000/api/member/login  email이 db에 존재하는데 password를 틀릴 경우
// {
//   "success": false,
//   "message": "Password Wrong"
// }

//암호찾기 기능 Api 라우터 구현
router.post('/find', async (req, res, next) => {
  //DB의 email, name 컬럼이 암호화 되어있지 않다고 가정
  var email = req.body.email;

  try {
    const member = await db.Member.findOne({ where: { email: email } });
    if (!member) {
      return res.json({ code: 400, data: null, resultMsg: 'Member not Found' });
    } else {
      const token = await jwt.sign(
        {
          member_id: member.member_id,
          email: email,
          name: member.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h', issuer: 'mormcamp' }
      );

      //메일로 링크 주소 발송
      console.log(token);

      return res.json({
        code: 200,
        data: token,
        resultMsg: `Send email to ${email}.`,
      });
    }
  } catch (err) {
    return res.json({
      code: 500,
      data: null,
      resultMsg: 'Server ERROR in /api/member/find POST',
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const member_list = [
      {
        member_id: 1,
        email: 'hwoarang09@naver.com',
        member_password: '맴버1비번',
        name: '윤성원',
        profile_img_path: '멤버1이미지주소',
        telephone: '01022883839',
        entry_type_code: 1,
        use_state_code: 1,
        birth_date: '900311',
        reg_date: Date.now(),
        reg_member_id: 881,
        edit_date: Date.now(),
        edit_member_id: 991,
      },
      {
        member_id: 2,
        email: 'rang0909@naver.com',
        member_password: '맴버2비번',
        name: '윤성일',
        profile_img_path: '멤버2이미지주소',
        telephone: '01122883839',
        entry_type_code: 1,
        use_state_code: 1,
        birth_date: '910312',
        reg_date: Date.now(),
        reg_member_id: 882,
        edit_date: Date.now(),
        edit_member_id: 992,
      },
      {
        member_id: 3,
        email: 'a01022883839@gmail.ocm',
        member_password: '맴버3비번',
        name: '윤성삼',
        profile_img_path: '멤버3이미지주소',
        telephone: '01222883839',
        entry_type_code: 0,
        use_state_code: 0,
        birth_date: '900313',
        reg_date: Date.now(),
        reg_member_id: 883,
        edit_date: Date.now(),
        edit_member_id: 993,
      },
    ];

    apiResult.code = 200;
    apiResult.data = member_list;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'failed';
  }

  //JSON데이터로 반환한다
  res.json(apiResult);
});

//entry api
router.post('/entry', async (req, res, next) => {
  let apiResult = apiResultSetFunc(200, '기본data', '기본resutl');

  console.log('entry start!!');
  try {
    let member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: req.body.profile_img_path,
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: 1,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: 1,
      edit_date: Date.now(),
      edit_member_id: 1,
    };

    console.log('entry  member!!', member);
    console.log('hi');
    member.member_password = await bcrypt.hash(member.member_password, 12);
    console.log('hi2');
    member.email = aes.encrypt(member.email, process.env.MYSQL_AES_KEY);
    console.log('hi3');
    member.telephone = aes.encrypt(member.telephone, process.env.MYSQL_AES_KEY);
    console.log('hi4');
    console.log('MEMBER---', member);

    search_member = await db.Member.findOne({
      where: {
        email: member.email,
      },
    });
    console.log('entry search_member!!', search_member);
    if (search_member)
      apiResult = apiResultSetFunc(
        400,
        'AlreadyExistEmail',
        '해당 이메일의 유저가 이미 존재합니다.'
      );
    else {
      let create_result = await db.Member.create(member);
      apiResult = apiResultSetFunc(
        200,
        create_result,
        '회원가입에 성공하셨습니다.'
      );
    }
  } catch (err) {
    apiResult = apiResultSetFunc(500, null, 'failed or server error! in entry');
  }
  res.json(apiResult);
});

router.post('/login', async (req, res, next) => {
  var apiResult = {
    code: 400,
    data: null,
    msg: '',
  };

  try {
    const { email, password } = req.body;
    const dbEmail = aes.encrypt(email, process.env.MYSQL_AES_KEY);

    //step1:로그인(인증)-동일메일주소 여부 체크
    const member = await db.Member.findOne({ where: { email: dbEmail } });
    var resultMsg = '';

    if (!member) {
      resultMsg = 'NotExistEmail';
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.msg = resultMsg;
    } else {
      var compareResult = await bcrypt.compare(
        password,
        member.member_password
      );
      if (compareResult) {
        resultMsg = 'Ok';
        member.member_password = '';
        member.telephone = aes.decrypt(
          member.telephone,
          process.env.MYSQL_AES_KEY
        );

        //step3: 인증된 사용자의 기본정보 JWT토큰 생성 발급
        //step3.1: JWT토큰에 담을 사용자 정보 생성
        //JWT인증 사용자정보 토큰 값 구조 정의 및 데이터 세팅
        const { member_id, email, name, profile_img_path, telephone } = member;

        //TOKEN 구조
        var memberTokenData = {
          member_id,
          email,
          name,
          profile_img_path,
          telephone,
          etc: '기타정보',
        };

        const token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, {
          expiresIn: '24h',
          issuer: 'myjeong19',
        });

        apiResult.code = 200;
        apiResult.data = token;
        apiResult.msg = resultMsg;
      } else {
        resultMsg = 'NotCorrectPassword';

        apiResult.code = 400;
        apiResult.data = null;
        apiResult.msg = resultMsg;
      }
    }
  } catch (err) {
    console.log('서버에러발생-/api/member/entry:', err.message);
    console.log(err);
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = 'Failed';
  }
  res.json(apiResult);
});

router.post('/password/update', async (req, res, next) => {
  try {

    //token DATA, DB member DATA 추출
    const token = req.headers.authorization;
    var tokenData = await jwt.verify(token, process.env.JWT_SECRET);
    var member = await db.Member.findOne({where:{member_id:tokenData.member_id}});

    var { currentPW, newPW} = req.body;

    if(!member){
      return res.json({code:400, data:null, resultMsg:"Member not found"});
    }else{
      // 입력한 currentPW와 member의 PW가 일치하면 update
      if (await bcrypt.compare(currentPW, member.member_password)){
        var updateMember = {
          member_password: await bcrypt.hash(newPW, 12),
          edit_date: Date.now(),
          edit_member_id: member.member_id
        };

        var test = await db.Member.update(updateMember, {where:{member_id:member.member_id}}); //여기에서 오류
        console.log(test); 
        return res.json({code:200, data:member.name, resultMsg:"password change success!"});

      } else{
        return res.json({code:400, data:null, resultMsg:"Password is not correct"});
      }
    }

  } catch (err) {
    return res.json({ code: 500, data: null, resultMsg: "Server ERROR in /api/member/password/update" });
  }

});


//GET /all
//에러처리
//1. http://localhost:3000/api/member/all/1 -> 정의되지 않은 라우터경로 처리
router.get('/all', async (req, res, next) => {
  try {
    const member_list = await db.Member.findAll({});
    res.send(member_list);
  } catch (err) {
    console.error('Error in member GET /all:', err);
    res.status(500).send('error in GET all!!!');
  }
});

//POST /create
//에러처리
//1. http://localhost:3000/api/member/create body에서 use_state_code="a" -> catch문
//2. http://localhost:3000/api/member/create/1 -> 정의되지 않은 라우터경로 처리
router.post('/create', async (req, res, next) => {
  try {
    let member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: req.body.profile_img_path,
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: req.body.use_state_code,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: req.body.reg_member_id,
      edit_date: Date.now(),
      edit_member_id: req.body.edit_member_id,
    };

    member.member_password = await bcrypt.hash(member.member_password, 12);
    member.email = await aes.encrypt(member.email, process.env.MYSQL_AES_KEY);
    member.telephone = await aes.encrypt(
      member.telephone,
      process.env.MYSQL_AES_KEY
    );
    await db.Member.create(member);
    console.log('member create : ', member);
    res.status(200).send(member);
  } catch (err) {
    console.error('Error in member POST /create:', err);
    res.status(500).send('error in POST create!!!');
  }
});

//POST /modify
//에러처리
//1. http://localhost:3000/api/member/modify body에서 member_id="a" -> catch문
//2. http://localhost:3000/api/member/modify/1 -> 정의되지 않은 라우터경로 처리
//3. http://localhost:3000/api/member/modify에서 body에 member_id=999 -> member not found in modify 처리
router.post('/modify', async (req, res, next) => {
  let member_id = req.body.member_id;
  try {
    let member = await db.Member.findOne({
      where: {
        member_id,
      },
    });
    if (!member) {
      // 멤버를 찾지 못한 경우
      return res.status(404).send('db.Member.not found in modify');
    }
    let mergedObject = await mergeByKey(
      member.toJSON(),
      req.body,
      ['member_password'],
      ['email', 'telephone']
    );
    //console.log("member : ", member);
    console.log('mergedObject : ', mergedObject);
    mergedObject.edit_date = Date.now();
    mergedObject.reg_date = Date.now();
    await db.Member.update(mergedObject, {
      where: {
        member_id,
      },
    });
    res.status(200).send(member);
  } catch (err) {
    console.error('Error in member POST /modify:', err);
    res.status(500).send('error in POST modify!!!');
  }
});

router.post('/memberModify', async (req, res, next) => {
  const { email, name, telephone } = req.body;
  const dbEmail = aes.encrypt(email, process.env.MYSQL_AES_KEY);

  const updateMember = {
    name,
    telephone: aes.encrypt(telephone, process.env.MYSQL_AES_KEY),
  };

  try {
    const selectedMember = await db.Member.findOne({
      where: { email: dbEmail },
    });
    console.log(selectedMember);

    if (selectedMember) {
      await db.Member.update(updateMember, { where: { email: dbEmail } });
      res.redirect('/main.html');
    }
  } catch (error) {
    console.log(error);
  }
});

//POST /delete
//에러처리
//1. http://localhost:3000/api/member/delete  -> body에 member id="ㅁㅁ"-> catch문
//2. http://localhost:3000/api/member/delete/1  -> 정의되지 않은 라우터 경로
//3. http://localhost:3000/api/member/delete -> body에 member id="999"-> member not found 처리
router.post('/delete', async (req, res, next) => {
  try {
    let member_id = req.body.member_id;
    let member = await db.Member.destroy({
      where: {
        member_id,
      },
    });

    if (!member || member.deletedCount === 0) {
      return res.status(404).send('db.Member.not found in POST delete');
    }
    //res.send(member);
    console.log('member_id in delte ', member_id, member);
    res.status(200).send({ member_id });
  } catch (err) {
    console.error('Error in member POST /delete:', err);
    res.status(500).send('error in POST /delete!!!');
  }
});

//GET /:mid
//에러처리
//1. http://localhost:3000/api/member/asd -> catch문
//2. http://localhost:3000/api/member/ -> 정의되지 않은 라우터경로 처리
//3. http://localhost:3000/api/member/999 -> member not found 처리

//현재 로그인한 유저의 정보를 token기반으로 출력
//로그인시 발급한 jwt토큰은 http header 영역에 포함되어 전달됨
router.get('/profile', tokenAuthChecking, async (req, res, next) => {
  console.log('/profile   start!!');
  var apiResult = {
    code: 400,
    data: null,
    msg: '',
  };

  try {
    console.log('/profile   try!!');
    //웹브라우저 헤더에서 사용자 jwt인증토큰값을 추출한다.
    var token = req.headers.authorization.split('Bearer ')[1];
    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
    var loginMemberId = tokenJsonData.member_id;
    var loginMemberEmail = tokenJsonData.email;

    console.log('/profile   before dbMember!!');
    //최신의 정보를 가져오려고. 처음 로긴한 후 중간에 바꿨을 수도 있으니까.
    var dbMember = await db.Member.findOne({
      where: { member_id: loginMemberId },
      attributes: [
        'email',
        'name',
        'profile_img_path',
        'telephone',
        'birth_date',
      ],
    });

    dbMember.telephone = aes.decrypt(
      dbMember.telephone,
      process.env.MYSQL_AES_KEY
    );
    dbMember.email = aes.decrypt(dbMember.email, process.env.MYSQL_AES_KEY);
    apiResult.code = 200;
    apiResult.data = dbMember;
    apiResult.msg = 'Ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = 'Failed';
  }

  res.json(apiResult);
});
//아래의 에러처리 코드는 무조건 router정의가 다 끝난 최하단에 위치해야 함.
//위에서 정의하지 않은 라우터에 대한 모든 요청에 대해서
//Error 객체를 생성하는 아래의 미들웨어를 실행한다.
router.get('/:mid', async (req, res, next) => {
  try {
    let member_id = req.params.mid;
    const member = await db.Member.findOne({
      where: {
        member_id,
      },
    });
    //console.log(`member_id : ${member_id}  member : ${member}`);
    if (!member) {
      // 멤버를 찾지 못한 경우
      return res.status(404).send('db.Member.not found');
    } else {
      // 멤버를 찾은 경우
      res.status(200).send(member);
    }
  } catch (err) {
    console.error('Error in member GET /:mid', err);
    res.status(500).send('error in GET /:mid!!! ');
  }
});

router.use((req, res, next) => {
  const error = new Error('정의되지 않은 라우터 경로입니다.');
  error.status = 404;
  next(error);
});

//위에서 받은 Error객체를 통해 화면에 처리하는 미들웨어
router.use((err, req, res, next) => {
  //console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = router;
