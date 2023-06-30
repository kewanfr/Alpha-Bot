
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

  verifUpdateReglement = async() => {
    let reglement = await Infos.findOne({
      where: {
        name: "reglement",
      }
    });

    if(!reglement) {
      reglement = await Infos.create({
        name: "reglement",
        value: client.config.reglement,
      });
    }
    
    if(reglement.value !== client.config.reglement) {
      reglement.value = client.config.reglement;
      await reglement.save();
      let users = await User.findAll({
        where: {
          accepted: true,
        }
      });
  
      for(let user of users) {
        user.accepted = false;
        await user.save();
      }
    }

  };


  getReglement = async() => {
    let reglement = await Infos.findOne({
      where: {
        name: "reglement",
      }
    });

    return reglement.value;
  };

  getLastReglementUpdate = async() => {
    let reglement = await Infos.findOne({
      where: {
        name: "reglement",
      }
    });

    return getDiscordTimestamp(reglement.updatedAt);
  }

  client.sqlite = new Sequelize({
    dialect: "sqlite",
    storage: "./data/db.sqlite",
    logging: false,
    sync: { alter: true }
  });

  const User = require("../models/User")(client);
  const Infos = require("../models/Infos")(client);

  await client.sqlite.sync({ alter: true });
  await verifUpdateReglement();
}