const {
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: {
    name: "set-bank",
    description: "Définir le solde d'un compte en banque",
    options: [
      {
        name: "user",
        description: "L'utilisateur à qui définir le solde",
        type: "USER",
        required: true,
      },
      {
        name: "money",
        description: "Le solde à définir",
        type: "INTEGER",
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
    const User = await getModel("User");

    let user = interaction.options.getUser("user");
    let money = interaction.options.getInteger("money");

    let dbUser = await User.update({
      bank: money
    }, {
      where: {
        user_id: user.id
      }
    });

    dbUser = dbUser[0];

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Solde défini !`)
      .setDescription(`${emojis.oui} Le solde du compte en banque de \`${user.username}\` a été défini à **${money}** ${emojis.koins} !`)
      .setColor("Green")
      .setTimestamp();
    
    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  },
};
