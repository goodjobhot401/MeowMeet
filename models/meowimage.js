'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class meowImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      meowImage.belongsTo(models.User, { foreignKey: 'userId' })
      meowImage.belongsTo(models.Meow, { foreignKey: 'meowId' })
    }
  };
  meowImage.init({
    user_id: DataTypes.INTEGER,
    meow_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'meowImage',
    underscored: true
  })
  return meowImage
}
