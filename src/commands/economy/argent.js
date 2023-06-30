const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "argent",
    description: "Voir le solde de ton porte monnaie",
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

    let userWallet = await Wallet.findOrCreate({
      where: {
        user_id: interaction.user.id,
      },
      defaults: {
        user_id: interaction.user.id,
        username: interaction.user.username,
      },
    });

    const getWalletEmbed = async (userWallet) => {
      return new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(
          `${emojis.arrow} **Solde de ton porte monnaie:** **${userWallet[0].dataValues.money}** ${emojis.kcoins} **Koins**\n\n` +
            `${emojis.arrow} Utilise ${await getSlashCommandMention(
              "bank"
            )} pour voir le solde de ton compte bancaire !\n` +
            `${emojis.arrow} Utilise ${await getSlashCommandMention(
              "depot"
            )} pour déposer de l'argent sur ton compte bancaire !\n` +
            `${emojis.arrow} Utilise ${await getSlashCommandMention(
              "retrait"
            )} pour retirer de l'argent de ton compte bancaire !\n` +
            `${emojis.arrow} Utilise ${await getSlashCommandMention(
              "transfer"
            )} pour transférer de l'argent à un autre utilisateur !\n`
        )
        .setTimestamp()
        .setColor("Blue");
    };

    let WalletEmbed = await getWalletEmbed(userWallet);

    let msg = await interaction.reply({
      embeds: [WalletEmbed],
      ephemeral: true,
    });
    
  },
};
