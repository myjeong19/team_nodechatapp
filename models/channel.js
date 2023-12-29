module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'channel',
    {
      channel_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '채널 고유 번호',
      },
      comunity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '커뮤니티 고유번호',
      },
      category_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '카테고리 코드',
      },

      channel_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '채널 명',
      },

      user_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '동시 채널 접속자 수',
      },
      channel_img_path: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '대표 이미지',
      },
      channel_desc: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: '채널 간략 소개',
      },
      channel_state_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '채널 오픈 상태 코드',
      },

      reg_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '등록일시',
      },
      reg_member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '등록자 고유 번호',
      },
      edit_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '수정일시',
      },

      edit_member_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '수정자 고유 번호',
      },
    },
    {
      sequelize,
      tableName: 'channel',
      timestamps: false,
      comment: '채널 정보',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'channel_id' }],
        },
      ],
    }
  );
};
