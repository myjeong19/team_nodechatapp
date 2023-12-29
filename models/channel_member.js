module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "channel_member",
    {
      channel_id: {
        type: DataTypes.INTEGER,
        //autoIncrement: true,
        //primaryKey: true,
        allowNull: false,
        comment: "채널고유번호",
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "사용자고유번호",
      },
      nick_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "채팅닉네임",
      },
      member_type_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "사용자유형",
      },
      active_state_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "접속상태코드",
      },
      last_contact_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "최근접속일시",
      },
      last_out_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "최근아웃일시",
      },
      connection_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "커넥션아이디",
      },
      ip_address: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "아이피주소",
      },

      edit_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "수정일시",
      },
      edit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "수정자아이디",
      },
    },
    {
      sequelize,
      tableName: "channel_member", //이게 찐 테이블명
      timestamps: false,
      comment: "채널채팅사용자정보",
      // indexes: [
      //   {
      //     name: "PRIMARY",
      //     unique: true,
      //     using: "BTREE",
      //     fields: [{ name: "channel_msg_id" }], //여러개의 컬럼이 프라미어리 키인경우 차가하여 설정가능
      //   },
      // ],
    }
  );
};
