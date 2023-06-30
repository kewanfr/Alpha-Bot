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

    var userWallet = await Wallet.findOrCreate({
      where: {
        user_id: interaction.user.id,
      },
      defaults: {
        user_id: interaction.user.id,
        username: interaction.user.username,
      },
    });

    let refreshButton = new ButtonBuilder()
      .setCustomId("refresh-wallet")
      .setLabel("Mettre à jour")
      .setStyle(ButtonStyle.Primary);
    let refreshRow = new ActionRowBuilder().addComponents(refreshButton);

    let walletEmbed = await getWalletEmbed(userWallet[0]);


    let msg = await interaction.reply({
      embeds: [walletEmbed],
      components: [refreshRow],
      ephemeral: true,
    });
    
  },
};
