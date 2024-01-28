const constants = require("../common/enum");
const { Op } = require("sequelize");
var db = require("../models/index");
module.exports = async (socket) => {
  socket.on("createGroupBtnFinal", (data) => {
    console.log("createGroupBtnFinal : ", data);
  });

  socket.on("createGroup", async ({ createGroupObject }) => {
    var data = createGroupObject;
    try {
      var resultFindChannel = await db.Channel.findOne({
        where: { channel_name: data.group_name },
      });

      //console.log("resultFindChannel : ", resultFindChannel.dataValues);
      var channel_id = resultFindChannel.dataValues.channel_id;
      var channel_name = resultFindChannel.dataValues.channel_name;
      var name = data.name;
      //만드는 당사자 입장
      socket.join(channel_id);
      socket.emit("entryok", `${data.name} 대화명으로 입장했습니다.`);
      socket
        .to(channelId)
        .emit(
          "entryok",
          `${data.name}님이 ${cahnnel_name} 채팅방을 생성했습니다.`
        );
      //다른 애들은 알빠아님.
    } catch (err) {
      console.log("err : ", err);
    }
  });
};
