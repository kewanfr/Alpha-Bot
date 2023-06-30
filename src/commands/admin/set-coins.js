const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "set-coins",
    description: "Définir le solde d'un porte monnaie",
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
    const Wallet = await getModel("Wallet");

    let user = interaction.options.getUser("user");
    let money = interaction.options.getInteger("money");

    let userWallet = await Wallet.update({
      money: money
    }, {
      where: {
        user_id: user.id
      }
    });

    userWallet = userWallet[0];

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Solde défini !`)
      .setDescription(`${emojis.oui} Le solde du porte monnaie de \`${user.username}\` a été défini à **${money}** ${emojis.kcoins} !`)
      .setColor("Green")
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  },
};
