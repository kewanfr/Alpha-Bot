
const fs = require("fs");
const { Sequelize, Op } = require("sequelize");

module.exports = async (client) => {
  if(!fs.existsSync("./data")) fs.mkdirSync("./data");

  getModel = async(modelName) => {
    switch(modelName) {
      case "User":
        return User;
      case "Counter":
        return Counter;
      case "DayCounter":
        return DayCounter;
      case "Infos":
        return Infos;
      default:
        return false;
    }
  };

  client.sqlite = new Sequelize({
    dialect: "sqlite",
    storage: "./data/db.sqlite",
    logging: false,
    sync: { alter: true }
  });

  
  const User = require("../models/User")(client);
  
  await client.sqlite.sync({ alter: true });
}