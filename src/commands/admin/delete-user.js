const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: {
    name: "delete-user",
    description: "Supprimer un utilisateur de la base de données",
    options: [
      {
        name: "user",
        description: "L'utilisateur a supprimer",
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

    const User = await getModel("User");
    const Wallet = await getModel("Wallet");

    let dbUser = await User.findOne({
      where: {
        user_id: user.id
      }
    });

    let userWallet = await Wallet.findOne({
      where: {
        user_id: user.id
      }
    });
    
    if(!dbUser && !userWallet){
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Utilisateur pas encore enregistré !`)
        .setDescription(`${emojis.non} L'utilisateur \`${user.username}\` n'est pas encore enregistré dans la base de données !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    await User.destroy({
      where: {
        user_id: user.id
      }
    });
    await Wallet.destroy({
      where: {
        user_id: user.id
      }
    });

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Utilisateur supprimé !`)
      .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a été supprimé de la base de données !`)
      .setColor("Green")
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  },
};
