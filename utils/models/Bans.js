const { Model, DataTypes } = require("sequelize");

module.exports = (client) => {
  class Bans extends Model {}
  Bans.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      user_id: DataTypes.STRING
    },
    {
      // Les options de votre modèle
      sequelize: client.sqlite,
      modelName: "Bans",
      tableName: "bans",
      timestamps: false,
    }
  );

  return Bans;
};
