const { Model, DataTypes } = require("sequelize");

module.exports = (client) => {
  class Infos extends Model {}
  Infos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      // Les options de votre modèle
      sequelize: client.sqlite,
      modelName: "Infos",
      tableName: "infos"
    }
  );

  return Infos;
};
