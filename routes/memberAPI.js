//회원 정보관리 MemberAPI 라우팅 파일
//기본주소: http://localhost:3000/api/member
var express = require('express');
var router = express.Router();

var member={
    "member_id": 4,
    "email": "hwoarang04@naver.com",
    "member_password": "맴버4비번",
    "name": "윤성원4",
    "profile_img_path": "멤버4이미지주소",
    "telephone": "01022883839",
    "entry_type_code": 4,
    "use_state_code": 4,
    "birth_date": "900311",

    "reg_member_id": 884,
    "edit_member_id": 994
}

//localhost:3000/api/member/all
router.get('/all', async(req,res)=>{
    res.render('member/list', {member});
});

//localhost:3000/api/member/create
router.post('/create', async(req,res)=>{
    var member_id=req.body.member_id;
    var email=req.body.email;
    var member_password=req.body.member_password;
    var name=req.body.name;
    var profile_img_path=req.body.profile_img_path;
    var telephone=req.body.telephone;
    var entry_type_code=req.body.entry_type_code;
    var use_state_code=req.body.use_state_code;
    var birth_date=req.body.birth_date;
    var reg_member_id=req.body.reg_member_id;
    var edit_member_id=req.body.edit_member_id;

    //전역으로 선언된 객체 member와 구분하기 위해 newMember라는 객체를 사용했습니다.
    var member={
        member_id,
        email,
        member_password,
        name,
        profile_img_path,
        telephone,
        entry_type_code,
        use_state_code,
        birth_date,
        reg_member_id,
        edit_member_id
    }

    res.json(member);
});

//localhost:3000/api/member/modify
router.post('/modify', async(req,res)=>{
    var member_id=req.body.member_id;
    var email=req.body.email;
    var member_password=req.body.member_password;
    var name=req.body.name;
    var profile_img_path=req.body.profile_img_path;
    var telephone=req.body.telephone;
    var entry_type_code=req.body.entry_type_code;
    var use_state_code=req.body.use_state_code;
    var birth_date=req.body.birth_date;
    var reg_member_id=req.body.reg_member_id;
    var edit_member_id=req.body.edit_member_id;

    //전역으로 선언된 객체 member와 구분하기 위해 newMember라는 객체를 사용했습니다.
    var newMember={
        member_id,
        email,
        member_password,
        name,
        profile_img_path,
        telephone,
        entry_type_code,
        use_state_code,
        birth_date,
        reg_member_id,
        edit_member_id
    }

    res.json(newMember);
});

//localhost:3000/api/member/delete
router.post('/delete', async(req,res)=>{
    var member_id=req.body.member_id;
    //삭제되었습니다

    res.redirect('/all');
});

//localhost:3000/api/member/:mid
router.get('/:mid', async(req,res)=>{
    var member_id=req.params.mid;
    var name=req.body.name;
    
    //member의 ID, 이름값만 임시로 전송
    res.render('member/detail', {member_id, name});
});

module.exports = router;
