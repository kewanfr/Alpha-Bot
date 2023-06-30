const { PermissionFlagsBits } = require("discord.js");

require("dotenv").config();
module.exports = {
  devmode: process.env.DEV_MODE === "true" ? true : false,
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  prefix: process.env.PREFIX ?? "!",

  users: {
    owners: [],
    developers: [],
  },
  
  channels: {},
  emojis: {
    bank: "<:Bank:1124300544429805690>🏦",
    arrow: "➜",
    accept: "✅",
    decline: "<:Warning:1124301508482191411>",
    warning: "<:Warning:1124301508482191411>",
    key: "<:Key:1124300754501505065>",
    kcoins: "<:Koins:1124303383264776242>",
    top: "<:Top:1124303380676882433>",
    text: "<:Text:1124302109437870192>"
  },
  images: {},
}