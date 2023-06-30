const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: {
    name: "pay",
    description: "Transférer de l'argent à un autre utilisateur",
    options: [
      {
        name: "utilisateur",
        description: "L'utilisateur à qui tu veux transférer de l'argent",
        type: "USER",
        required: true,
      },
      {
        name: "montant",
        description: "Le montant que tu veux déposer",
        type: "INTEGER",
        required: true,
      }
    ],
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
    let user = interaction.options.getUser("utilisateur");
    let amount = interaction.options.getInteger("montant");

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

    let userWallet2 = await Wallet.findOrCreate({
      where: {
        user_id: user.id,
      },
      defaults: {
        user_id: user.id,
        username: user.username,
      },
    });

    userWallet = userWallet[0];
    userWallet2 = userWallet2[0];

    if (userWallet.dataValues.money < amount) {
      
      const embed = new EmbedBuilder()
        .setTitle(`${emojis.error} Kolaxx Bank`)
        .setDescription(
          `${emojis.non} Tu n'as pas assez d'argent sur ton porte monnaie !`
        )
        .setColor("Red");

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    userWallet.decrement("money", {
      by: amount,
    });

    userWallet2.increment("money", {
      by: amount,
    });

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Kolaxx Bank`)
      .setDescription(
        `${emojis.oui} Tu as transféré **${amount}** ${emojis.kcoins} **Koins** à **${user.username}** !`
      )
      .setColor("Green");

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    
  },
};
