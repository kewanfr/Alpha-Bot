const { Events, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  dev: true,
  /**
   * 
   * @param {Client} client 
   */
  execute: async (client) => {
    console.ready(`Connecté en tant que ${client.user.tag}!`);
  },
};
