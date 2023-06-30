const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "ban",
    description: "Bannir un utilisateur de la banque",
    options: [
      {
        name: "user",
        description: "L'utilisateur a bannir",
        type: "USER",
        required: true,
      }
    ]
  },
  guildOnly: true,
  disabled: false,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const emojis = client.config.emojis;
    const Bans = await getModel("Bans");

    let user = interaction.options.getUser("user");
    
    await Bans.create({
      user_id: user.id,
      username: user.username
    });

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Utilisateur banni !`)
      .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a été banni de la banque !`)
      .setColor("Green")
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  },
};
