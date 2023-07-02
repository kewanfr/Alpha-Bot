const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: {
    name: "ban",
    description: "Bannir un utilisateur du serveur",
    options: [
      {
        name: "user",
        description: "L'utilisateur a bannir",
        type: "USER",
        required: true,
      },
      {
        name: "reason",
        description: "La raison du ban",
        type: "STRING",
        required: false,
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
    let reason = interaction.options.getString("reason") ?? "Aucune raison spécifiée";

    let member = interaction.guild.members.cache.get(user.id);

    if (member && !member.bannable) {
      let embed = new EmbedBuilder()
        .setTitle(`L'utilisateur ne peut être banni !`)
        .setDescription(`${emojis.non} L'utilisateur \`${user.username}\` n'est pas bannable !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    }

    if (member && member.roles.highest.position >= interaction.member.roles.highest.position) {
      let embed = new EmbedBuilder()
        .setTitle(`L'utilisateur ne peut être banni !`)
        .setDescription(`${emojis.non} L'utilisateur \`${user.username}\` a un rôle supérieur au votre !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    }
    

    try {
      await guild.members.ban(user.id, { reason });
      let embed = new EmbedBuilder()
        .setTitle(`Utilisateur banni !`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` (ID: ${user.id}) a été banni du serveur !`)
        .setColor("Green")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    } catch (error) {
      if (error.code == 50013) {
        let embed = new EmbedBuilder()
          .setTitle(`Permissions manquantes !`)
          .setDescription(`${emojis.non} Je n'ai pas la permission de bannir l'utilisateur \`${user.username}\` !`)
          .setColor("Red")
          .setTimestamp();

        return interaction.reply({
          embeds: [embed]
        });
      }
      console.log(error);
      return interaction.reply({
        content: `${emojis.non} Une erreur est survenue lors du bannissement de l'utilisateur \`${user.username}\` !`
      });
    }
  },
};
