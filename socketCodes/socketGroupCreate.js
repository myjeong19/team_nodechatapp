module.exports = function (socket) {
  socket.on("createGroupBtnFinal", (data) => {
    console.log("createGroupBtnFinal : ", data);
  });
};
