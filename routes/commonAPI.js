var express = require('express');
var router = express.Router();

var moment = require('moment');


//multer 멀터 업로드 패키지 참조하기
var multer = require('multer');


//multer 멀터 파일저장위치 지정
var storage  = multer.diskStorage({ 
    destination(req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
        
        //여기서 올리는 시간을 적어주는 이유는 파일명이 중복되면 덥어쓰기가 됨으로 방지를 위해서 시간을 적어줍니다.
        cb(null, `${moment(Date.now()).format('YYYYMMDDHHMMss')}_${file.originalname}`);
    },
});


//multer 일반 업로드 처리 객체 생성
var upload = multer({ storage: storage });



//단일 파일업로드 처리 RESSTFul API 라우팅메소드
//환경설정 사용자 이미지 파일 업로드
//http://localhost:3000/api/common/upload
router.post('/upload',upload.single('uploadProfile'),async(req,res)=>{

    var apiResult = {
        code:200,
        data:null,
        resultMsg:""
    };

    try{

    //step1-2: 업로드된 파일정보 체크하기
    const uploadFile = req.file;


    var filePath ="/upload/"+uploadFile.filename; //서버에 실제 업로드된 물리적 파일명-도메인 주소가 생략된 파일링크주소
    var fileName = uploadFile.filename; //서버에 저장된 실제 물리파일명(파일명/확장자포함)
    var fileOrignalName = uploadFile.originalname; //클라이언트에서 선택한 오리지널 파일명
    var fileSize = uploadFile.size; //파일 크기(KB)
    var fileType=uploadFile.mimetype; //파일 포맷

    apiResult.code = 200;
    apiResult.data = {filePath,fileName,fileOrignalName,fileSize,fileType};
    apiResult.resultMsg = "ok";
        
    }catch(err){

    apiResult.code = 500;
    apiResult.data = {};
    apiResult.resultMsg = "failed";

    }


    res.json(apiResult);

});





module.exports = router;