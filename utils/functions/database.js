
const fs = require("fs");
const { Sequelize, Op } = require("sequelize");

module.exports = async (client) => {
  if(!fs.existsSync("./data")) fs.mkdirSync("./data");

  getModel = async(modelName) => {
    switch(modelName) {
      case "User":
        return User;
      case "Wallet":
        return Wallet;
      case "Infos":
        return Infos;
      case "Bans":
        return Bans;
      case "Vocaux":
        return Vocaux;
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

  isUserBanned = async(user_id) => {
    let ban = await Bans.findOne({
      where: {
        user_id: user_id,
      }
    });
    return ban ? true : false;
  };

  client.sqlite = new Sequelize({
    dialect: "sqlite",
    storage: "./data/db.sqlite",
    logging: false,
    sync: { alter: true }
  });
  
  const User = require("../models/User")(client);
  const Infos = require("../models/Infos")(client);
  const Wallet = require("../models/Wallet")(client);
  const Bans = require("../models/Bans")(client);
  const Vocaux = require("../models/Vocaux")(client);

  await client.sqlite.sync({ alter: true });
  await verifUpdateReglement();
}