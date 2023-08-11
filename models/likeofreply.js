'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LikeOfReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LikeOfReply.belongsTo(models.User, { foreignKey: 'userId' })
      LikeOfReply.belongsTo(models.Reply, { foreignKey: 'replyId' })
    }
  };
  LikeOfReply.init({
    reply_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LikeOfReply',
    tableName: 'LikeOfReplies',
    underscored: true
  })
  return LikeOfReply
}
