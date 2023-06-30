const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: {
    name: "unban",
    description: "Débannir un utilisateur du serveur",
    options: [
      {
        name: "user",
        description: "L'utilisateur a débannir",
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

    let user = interaction.options.getUser("user");
    let guild = interaction.guild;

    let bannedUsers = await guild.bans.fetch();
    let banned = bannedUsers.find(user => user.user.id === user.id);
  
    if (!banned) {
      let embed = new EmbedBuilder()
        .setTitle(`Utilisateur pas encore banni !`)
        .setDescription(`${emojis.non} L'utilisateur \`${user.username}\` n'est pas encore banni !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    }

    try {
      await guild.members.unban(user.id);
      let embed = new EmbedBuilder()
        .setTitle(`Utilisateur débanni !`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a été débanni du serveur !`)
        .setColor("Green")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: `${emojis.non} Une erreur est survenue lors du débanissement de l'utilisateur \`${user.username}\` !`
      });
    }

  },
};
