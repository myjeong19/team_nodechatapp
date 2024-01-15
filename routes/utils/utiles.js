//modify할 때 쓰이는 함수
//modify에서 선언하면, route주소로 접근할때마다 함수가 재선언되니까 전역으로 선언함.
//밑에서 다시 설명.

const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");

const mergeByKey = async (
  baseObj,
  otherObj,
  bcrypt_keys = [],
  aes_keys = []
) => {
  return await Object.keys(baseObj).reduce(async (promise, key) => {
    let result = await promise;

    if (bcrypt_keys.includes(key))
      result[key] = await bcrypt.hash(otherObj[key], 12);
    else if (aes_keys.includes(key))
      result[key] = aes.encrypt(otherObj[key], process.env.MYSQL_AES_KEY);
    else result[key] = otherObj[key];
    return result;
  }, baseObj);
};

const apiResultSetFunc = function (code, data, resultMsg) {
  let apiResult = {};
  apiResult.code = code;
  apiResult.data = data;
  apiResult.resultMsg = resultMsg;

  return apiResult;
};
//channel_id : 채널이름
//매칭 오브젝트
var channel_id_value_obj = {
  "": "전체",
  1: "연구소채널",
  2: "모름캠프채널",
  3: "삼성채널",
  4: "구글채널",
  5: "카카오채널",
  6: "라이엇채널",
};

var msg_type_code_value_obj = {
  "": "전체",
  0: "퇴장",
  1: "입장",
  3: "일반메세지",
  4: "파일메세지",
};
module.exports = {
  mergeByKey,
  apiResultSetFunc,
  channel_id_value_obj,
  msg_type_code_value_obj,
};
