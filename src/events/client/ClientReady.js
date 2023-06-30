const { Events, Client, EmbedBuilder, ActivityType } = require("discord.js");

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

    client.user.setPresence({
      status: "online",
      activities: [{
        name: "La kolaxx Bank",
        type: ActivityType.Watching
      }]
    });
  },
};
