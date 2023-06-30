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

    if (await isUserBanned(interaction.user.id)) {
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Utilisateur banni !`)
        .setDescription(
          `${emojis.non} Tu as été banni de la banque !\n\n` +
            `${emojis.arrow} Tu ne peux plus utiliser les commandes de la banque !\n` +
            `${emojis.arrow} Tu peux contacter le staff pour plus d'informations !`
        )
        .setColor("Red")
        .setTimestamp();
      
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

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
          `${emojis.arrow} **Solde de ton porte monnaie:** **${userWallet[0].dataValues.money}** ${emojis.koins} **Koins**\n\n` +
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
              "pay"
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
