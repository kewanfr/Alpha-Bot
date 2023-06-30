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
  emojis: {},
  images: {},
}