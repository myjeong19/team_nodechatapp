const constants = require("../common/enum");
const { Op } = require("sequelize");
var db = require("../models/index");
module.exports = async (socket) => {
  socket.on("1", (data) => {
    console.log("1 : ", data);
  });
};
