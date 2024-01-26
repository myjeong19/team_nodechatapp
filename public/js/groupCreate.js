var addGroupList = [];
var addGroupList_de = [];
var createGroupObject = {};

$("#createGroupBtn").click(function () {
  addGroupList = [];
  addGroupList_de = [];
});

$("#createGroupBtnFinal").click(function () {
  var loginUserToken = localStorage.getItem("userauthtoken");
  var groupName = document.getElementById("createGroupNameInput").value;
  createGroupObject = {
    email: currentUser.email,
    member_id: currentUser.member_id,
    name: currentUser.name,
    group_name: groupName,
    group_image_path: "",
    member_list: addGroupList.join(", "),
    member_list_de: addGroupList_de.join(", "),
  };

  console.log("createGroupObject : ", createGroupObject);
  socket.emit("createGroupBtnFinal", { createGroupObject });
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
        console.log("resutl : ", result);
        //유효성 검사
        //1. 이미 리스트에 email이 있는지
        var emailIncludes = addGroupList.includes(result.data.email);
        if (emailIncludes) {
          alert("이메일을 이미 추가했음");
          return false;
        }
        addGroupList.push(result.data.email);
        addGroupList_de.push(result.data.email_de);
        console.log("addGroupList : ", addGroupList);
        console.log("addGroupList_de : ", addGroupList_de);
        createGroupObject = {
          owner: currentUser.email,
          group_name: groupName,
          group_image_path: "",
          member_list: addGroupList.join(", "),
          member_list_de: addGroupList_de.join(", "),
        };
        console.log("createGroupObject : ", createGroupObject);
      } else if (result.code == 400) {
        console.log(result.result);
        alert(`error : ${result.result}`);
      }
    },
  });
});
