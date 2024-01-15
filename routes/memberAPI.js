var express = require('express');
var router = express.Router();
var db = require('../models/index');
var bcrypt = require('bcryptjs');
var AES = require('mysql-aes');
var jwt = require('jsonwebtoken');
var multer = require('multer');

//해당 객체를 frontend로 전송합니다.
//변수명 수정하지 말고 이걸로 사용해주세요! 
var apiResult = {
    code: 400,
    data: null,
    resultMsg: ""
  };

//암호찾기 기능 Api 라우터 구현
router.post('/find', async(req,res,next)=>{
    //DB의 email, name 컬럼이 암호화 되어있지 않다고 가정
    var email = req.body.email;

    try{
        const member = await db.Member.findOne({where:{email:email}});
        if(!member){
            return res.json({code:400, data:null, resultMsg:"Member not Found"});
        }else{
            const token = await jwt.sign({
                member_id:member.member_id,
                email:email,
                name:member.name,
            }, process.env.JWT_SECRET, {expiresIn:'24h', issuer:'mormcamp'});

            //메일로 링크 주소 발송
            console.log(token);

            return res.json({code:200, data:token, resultMsg:`Send email to ${email}.`});
        }
    }catch(err){
        return res.json({code:500, data:null, resultMsg:"Server ERROR in /api/member/find POST"});
    }
});


router.get('/all',async(req,res)=>{

    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{
        
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
                edit_member_id: 991
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
                edit_member_id: 992
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
                edit_member_id: 993
            }
        ];

        apiResult.code = 200;
        apiResult.data = member_list;
        apiResult.result = "ok";


    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";
    }



    //JSON데이터로 반환한다
    res.json(apiResult);
});



router.post('/create',async(req,res)=>{

    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        //신규 사용자가 입력한 값을 추출한다
        var email = req.body.email;
        var member_password = req.body.member_password;
        var name = req.body.name;
        var profile_img_path = req.body.profile_img_path;
        var telephone = req.body.telephone;
        var entry_type_code = req.body.entry_type_code;
        var birth_date = req.body.birth_date;


        var member = {
            member_id: 1,
            email,
            member_password,
            name,
            profile_img_path,
            telephone,
            entry_type_code,
            use_state_code:1,
            birth_date,
            reg_date: Date.now(),
            reg_member_id: 881,
            edit_date: Date.now(),
            edit_member_id: 991
        };


        const savedMember = {
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
            edit_member_id: 993
        }

        apiResult.code = 200;
        apiResult.data = savedMember;
        apiResult.result = "ok";


    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";
    }



    res.json(apiResult);
});


router.post('/modify',async(req,res)=>{


    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    try{

        var member_id = req.body.member_id;

        var email = req.body.email;
        var member_password = req.body.member_password;
        var name = req.body.name;
        var profile_img_path = req.body.profile_img_path;
        var telephone = req.body.telephone;
        var entry_type_code = req.body.entry_type_code;
        var birth_date = req.body.birth_date;

        var member = {
            member_id,
            email,
            member_password,
            name,
            profile_img_path,
            telephone,
            entry_type_code,
            use_state_code:1,
            birth_date,
            reg_date: Date.now(),
            reg_member_id: 881,
            edit_date: Date.now(),
            edit_member_id: 991
            };

            var affectedCnt = 1;

            apiResult.code = 200;
            apiResult.data = affectedCnt;
            apiResult.result = "ok";


    }catch(err){

        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "failed";

    }


    res.json(apiResult);
});





router.post('/delete',async(req,res)=>{


    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        var member_id = req.body.member_id;

        var deletedCnt = 1;

        apiResult.code = 200;
        apiResult.data = deletedCnt;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "failed";

    }



    res.json(apiResult);
});




//   localhost:3000/api/member/1
router.get('/:mid',async(req,res)=>{

    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        var member_id = req.params.mid;


        var member = {
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
            edit_member_id: 992
        }


        apiResult.code = 200;
        apiResult.data = member;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "ok";

    }



    res.json(apiResult);
});


module.exports = router;