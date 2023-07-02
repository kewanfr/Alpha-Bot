const Sequelize = require("sequelize");

module.exports = (client) => {
  class Bans extends Sequelize.Model {}
  Bans.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: Sequelize.STRING,
      channel_id: Sequelize.STRING,
      guild_id: Sequelize.STRING,
      config_channel_id: Sequelize.STRING,
      open: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      invited_users: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      banned_users: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      sizeLimit: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    },
    {
      // Les options de votre modèle
      sequelize: client.sqlite,
      modelName: "Vocaux",
      tableName: "vocaux",
      timestamps: false,
    }
  );

  return Bans;
};
