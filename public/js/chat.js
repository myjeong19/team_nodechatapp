//const constants = require("../common/enum");
console.log("111");
//const aes = require("mysql-aes");
//import * as aes from "mysql-aes";
console.log("112");
var addGroupList = [];
var createGroupObject = {};

$("#createGroupBtn").click(function () {
  addGroupList = [];
});

$("#createGroupBtnFinal").click(function () {
  var loginUserToken = localStorage.getItem("userauthtoken");
  var groupName = document.getElementById("createGroupNameInput").value;
  createGroupObject = {
    owner: currentUser.email,
    group_name: groupName,
    group_image_path: "",
    member_list: addGroupList.join(", "),
  };
  console.log("createGroupObject : ", createGroupObject);
  $.ajax({
    type: "POST",
    url: "/api/channel/create",
    data: createGroupObject,
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",

    success: function (result) {
      console.log("success :", result);
    },
  });
});

$("#createGroupAddEmailBtn").click(function () {
  var email = $("#createGroupAddEmailInput").val();
  var groupName = document.getElementById("createGroupNameInput").value;
  console.log("hi, ", email, groupName);
  var loginUserToken = localStorage.getItem("userauthtoken");

  $.ajax({
    type: "POST",
    url: "/api/member/add",
    data: {
      email: email,
    },
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",

    success: function (result) {
      if (result.code == 200) {
        //var groupName = $("createGroupNameInput").val();
        addGroupList.push(result.data.email);
        createGroupObject = {
          owner: currentUser.email,
          group_name: groupName,
          group_image_path: "",
          member_list: addGroupList.join(", "),
        };
        console.log("createGroupObject : ", createGroupObject);
      }
    },
  });
});
socket.on("receiveTest", function (data) {
  console.log("receiveTest!!", data);
  var className =
    data.nickName === currentNickName ? "chat-left" : "chat-right";
  var msgTag = `<li class="${className}">
    <div class="chat-avatar">
      <img src="img/user21.png" alt="Quick Chat Admin" />
      <div class="chat-name">${data.nickName}</div>
    </div>
    <div class="chat-text-wrapper">
      <div class="chat-text">
        <p>${data.message}</p>
        <div class="chat-hour read">
          ${data.sendDate} <span>&#10003;</span>
        </div>
      </div>
    </div>
  </li>`;
  $("#chat-box").append(msgTag);
  //채팅영역 맨 하단으로 스크롤 이동처리
  chatScrollToBottom();
});

socket.on("receiveChannelMsg", function (data) {
  console.log("receiveTest!!", data);
  var className =
    data.nickName === currentNickName ? "chat-left" : "chat-right";
  var msgTag = `<li class="${className}">
    <div class="chat-avatar">
      <img src=${data.profile} alt="Quick Chat Admin" />
      <div class="chat-name">${data.nickName}</div>
    </div>
    <div class="chat-text-wrapper">
      <div class="chat-text">
        <p>${data.message}</p>
        <div class="chat-hour read">
          ${data.sendDate} <span>&#10003;</span>
        </div>
      </div>
    </div>
  </li>`;
  $("#chat-box").append(msgTag);
  //채팅영역 맨 하단으로 스크롤 이동처리
  chatScrollToBottom();
});
//채팅방 입장완료 메시지 수신기 정의 기능구현
socket.on("entryOk", function (msg, nickName, channelData) {
  var msgTag = `<li class="divider">${msg}</li>`;

  currentChannel = channelData;
  console.log("msgTag : ", msgTag);
  $("#chat-box").append(msgTag);
});

$("#contacts-tab").click(function () {
  var loginUserToken = localStorage.getItem("userauthtoken");

  $.ajax({
    type: "GET",
    url: "/api/member/allUser",
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",

    success: function (result) {
      console.log("백엔드호출 API 호출 결과 : ", result);
      if (result.code == 200) {
        //$(".contacts-list").html("");
        var data = {
          memberId: currentUser.member_id,
          name: currentUser.name,
          //channelType: constants.CHANNEL_TYPE_ONE_VS_ONE,
          channelType: 1,
        };
        $.each(result.data, function (index, user) {
          var userTag = `                  <li onClick="fnChatEntry(${data});">
          <a href="#">
            <div class="contacts-avatar">
              <span class="status busy"></span>
              <img src=${user.profile_img_path} alt="Avatar" />
            </div>
            <div class="contacts-list-body">
              <div class="contacts-msg">
                <h6 class="text-truncate">${user.name}</h6>
                <p class="text-truncate">${user.email}</p>
              </div>
            </div>
            <div class="contacts-list-actions">
              <div class="action-block">
                <img src="img/dots.svg" alt="Actions" />
              </div>
              <div class="action-list">
                <span class="action-list-item">Chat User</span>
                <span class="action-list-item">Remove User</span>
              </div>
            </div>
          </a>
        </li>`;

          $(".contacts-list").append(userTag);
        });
      } else {
        if (result.code == 400) {
          alert(result.code);
        }
      }
    },
    error: function (err) {
      console.log("백엔드호출 API 호출 에러 발생 : ", err);
    },
  });
});

$("#btnSend").click(function () {
  var channelId = currentChannel.channel_id;
  var memberId = currentUser.member_id;
  var nickName = currentUser.name;
  var profile = currentUser.profile_img_path;
  var message = $("#messageInputArea").val();

  socket.emit("channelMsg", {
    channelId,
    memberId,
    nickName,
    message,
    profile,
  });
});

function fnChatEntry(data) {
  console.log("member_id : ", data.member_id);
  console.log("name : ", data.name);

  //step1 : 채팅방 입장처리
  var channel = {
    channelType, //1 : 일대일, 2 : 그룹채널
    channelId: 0, //0 : 일대일, 0이상이면 그룹채널 고유번호
    token: localStorage.getItem("userauthtoken"),
    targetMemberId: data.member_id,
    targetNickName: data.name,
  };
  console.log("channel : ", channel);
  socket.emit("entryChannel", { channel });
  //step2 :
  $(".empty-chat-screen").addClass("d-none");
  $(".chat-content-wrapper").removeClass("d-none");
  //$(".users-container .users-list li").removeClass("active-chat");
  //$(this).addClass("active-chat");
}

//채팅영역 스크롤 최하단 이동시키기
function chatScrollToBottom() {
  $("#chatScroll").scrollTop($("#chatScroll")[0].scrollHeight);
}
