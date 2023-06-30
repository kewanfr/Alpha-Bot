const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "unban",
    description: "Dé bannir un utilisateur de la banque",
    options: [
      {
        name: "user",
        description: "L'utilisateur a débannir",
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
    
    await Bans.destroy({
      where: {
        user_id: user.id
      }
    });

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Utilisateur débanni !`)
      .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a été débanni de la banque !`)
      .setColor("Green")
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  },
};
