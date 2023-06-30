const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "set-description",
    description: "Définir la description de votre profil",
    options: [
      {
        name: "description",
        description: "La description de votre profil",
        type: "STRING",
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
    const User = await getModel("User");
    let description = interaction.options.getString("description");

    let dbUser = await User.findOne({
      where: {
        user_id: interaction.user.id
      }
    });

    if (!dbUser) {
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Vous n'avez pas encore de compte !`)
        .setDescription(`${emojis.non} Vous devez créer un compte pour pouvoir utiliser cette commande !`)
        .setColor("Red")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    await dbUser.update({
      description: description
    });

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Description définie !`)
      .setDescription(`${emojis.oui} Votre description a bien été définie !\n\n**Description:** \`${description}\``)
      .setColor("Green")
      .setTimestamp();
      
    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  },
};
