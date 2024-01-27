var addGroupList = [];
var addGroupList_de = [];
var createGroupObject = {};

let unstackUser = function (email, email_de) {
  console.log("email unstack ", email_de, email);
  let htmlId = email + "_o";
  $("#" + htmlId).remove();

  let indexToRemove = addGroupList.indexOf(email);
  if (indexToRemove !== -1) {
    addGroupList.splice(email, 1);
  }
  indexToRemove = addGroupList_de.indexOf(email_de);
  if (indexToRemove !== -1) {
    addGroupList_de.splice(email_de, 1);
  }
  createGroupObject.member_list = addGroupList.join(", ");
  createGroupObject.member_list_de = addGroupList_de.join(", ");

  console.log("createGroupObject : ", createGroupObject);
};

$("#createGroupBtn").click(function () {
  addGroupList = [];
  addGroupList_de = [];
  var createGroupStackedUsers = document.getElementById(
    "createGroupStackedUsers"
  );
  createGroupStackedUsers.innerHTML = "";
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
  var email = document.getElementById("createGroupAddEmailInput");

  var groupName = document.getElementById("createGroupNameInput");
  var createGroupStackedUsers = document.getElementById(
    "createGroupStackedUsers"
  );

  console.log("hi, ", email.value, groupName.value);
  var loginUserToken = localStorage.getItem("userauthtoken");

  $.ajax({
    type: "POST",
    url: "/api/member/add",
    data: {
      email: email.value,
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
          group_name: groupName.value,
          group_image_path: "",
          member_list: addGroupList.join(", "),
          member_list_de: addGroupList_de.join(", "),
        };
        console.log("createGroupObject : ", createGroupObject);
        var stackUserCircle = `<div class="stacked-user" id="${
          result.data.email + "_o"
        }" name="${result.data.email + "_o"}">
        <img src="${result.data.profile_img_path}" alt="User" />
        <span class="delete-user">
          <img src="img/close.svg" alt="Remove User" id="${
            result.data.email + "_x"
          }" name="${result.data.email + "_x"}"/>
        </span>
      </div>`;

        //createGroupStackedUsers.innerHTML += stackUserCircle;

        $("#createGroupStackedUsers").append(stackUserCircle);
        document
          .getElementById(result.data.email + "_x")
          .addEventListener("click", function () {
            unstackUser(result.data.email, result.data.email_de);
          });
        email.value = "";
      } else if (result.code == 400) {
        console.log(result.result);
        alert(`error : ${result.result}`);
      }
    },
  });
});
