const { Model, DataTypes } = require("sequelize");

module.exports = (client) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Les options de votre modèle
      sequelize: client.sqlite,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
