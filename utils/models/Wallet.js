const { Model, DataTypes } = require("sequelize");

module.exports = (client) => {
  class Wallet extends Model {}
  Wallet.init(
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
      money: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      last_daily: {
        type: DataTypes.DATE,
        defaultValue: null,
      }
    },
    {
      // Les options de votre modèle
      sequelize: client.sqlite,
      modelName: "Wallet",
      tableName: "wallets",
      timestamps: false,
    }
  );

  return Wallet;
};
