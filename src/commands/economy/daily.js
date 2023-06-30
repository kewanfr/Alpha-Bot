const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "daily",
    description: "Récupérer ton argent quotidien",
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

    let moneyToGive = 250;

    let lastDaily = userWallet[0].dataValues.last_daily;

    if (lastDaily) {
      let lastDailyDate = new Date(lastDaily);
      let now = new Date();
      let diff = Math.abs(now - lastDailyDate);
      let diffHours = Math.ceil(diff / (1000 * 60 * 60));

      if (diffHours < 24) {
        let nextDaily = lastDailyDate;
        nextDaily.setHours(lastDailyDate.getHours() + 24);

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${emojis.bank} Kolaxx Bank`)
              .setDescription(
                `${emojis.warning} Tu as déjà récupéré ton argent quotidien !\n` +
                  `${emojis.arrow} Tu pourras récupérer ton argent quotidien ${getDiscordTimestamp(nextDaily)} !`
              )
              .setTimestamp()
              .setColor("Blue"),
          ],
          ephemeral: true,
        });
      }
    }

    await Wallet.update(
      {
        money: userWallet[0].dataValues.money + moneyToGive,
        last_daily: new Date(),
      },
      {
        where: {
          user_id: interaction.user.id,
        },
      }
    );

    let WalletEmbed = new EmbedBuilder()
      .setDescription(
        `${emojis.arrow} Tu as récupéré ton argent quotidien !\n` +
        `${emojis.arrow} Tu as reçu **${moneyToGive}** ${emojis.kcoins} **Koins** !\n` +
        `Tu as maintenant **${userWallet[0].dataValues.money + moneyToGive}** ${emojis.kcoins} **Koins** !`
      )
      .setTimestamp()
      .setColor("Blue");

    let msg = await interaction.reply({
      embeds: [WalletEmbed],
      ephemeral: true,
    });

    
  },
};
