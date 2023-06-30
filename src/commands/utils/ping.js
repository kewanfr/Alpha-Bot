module.exports = {
  data:
  {
    name: "ping",
    description: "Renvoie la latence du bot",
  },
  guildOnly: false,
  disabled: false,
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  run: async (client, interaction) => {
    const message = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });
    const newMessage = `🏓 Pong!\nPing de l'API: ${
      client.ws.ping
    }ms\nPing du Client: ${
      message.createdTimestamp - interaction.createdTimestamp
    }ms`;
    await interaction.editReply({
      content: newMessage,
      ephemeral: true,
    });
  },
};
