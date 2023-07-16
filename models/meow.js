'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Meow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Meow.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Meow.init({
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    color: DataTypes.STRING,
    neuter: DataTypes.STRING,
    age: DataTypes.STRING,
    friendly: DataTypes.INTEGER,
    location: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    intro: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Meow',
    tableName: 'Meows'
  })
  return Meow
}
