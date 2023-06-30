const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: {
    name: "bank-ban",
    description: "Bannir un utilisateur de la banque",
    options: [
      {
        name: "user",
        description: "L'utilisateur a bannir",
        type: "USER",
        required: true,
      }
    ],
    defaultMemberPermission: PermissionsBitField.Flags.Administrator
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

    let banned = await Bans.findOne({
      where: {
        user_id: user.id
      }
    });

    if (banned) {
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Utilisateur déjà banni !`)
        .setDescription(`${emojis.non} L'utilisateur \`${user.username}\` est déjà banni de la banque !`)
        .setColor("Red")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
    
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
