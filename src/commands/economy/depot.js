const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: {
    name: "depot",
    description: "Déposer de l'argent sur ton compte bancaire",
    options: [
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
    const Wallet = await getModel("Wallet");
    const User = await getModel("User");

    let dbUser = await User.findOne({
      where: {
        user_id: interaction.user.id,
      },
    });

    if(!dbUser) {
      let alreadyEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu ne possèdes pas encore de compte sur le serveur !\nUtilise ${await getSlashCommandMention("create-account")} pour te créer un compte !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyEmbed],
        ephemeral: true,
      })
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

    userWallet = userWallet[0];

    let montant = interaction.options.getInteger("montant");

    if(montant < 0) {
      let errorEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu ne peux pas déposer un montant négatif !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      })
    }

    if(montant > userWallet.dataValues.money) {
      let errorEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu ne peux pas déposer plus que ce que tu as dans ton porte monnaie !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      })
    }

    let newMoney = userWallet.dataValues.money - montant;

    dbUser = await dbUser.update({
      bank: dbUser.bank + montant,
    });
    userWallet = await userWallet.update({
      money: newMoney,
    });


    let successEmbed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Kolaxx Bank`)
      .setDescription(`${emojis.oui} Tu as déposé **${montant}** ${emojis.kcoins} **Koins** sur ton compte bancaire depuis ton porte monnaie !` +
        `\nTu as maintenant **${userWallet.dataValues.money}** ${emojis.kcoins} **Koins** dans ton porte monnaie et **${dbUser.bank}** ${emojis.kcoins} **Koins** sur ton compte bancaire !`
      )
      .setTimestamp()
      .setColor("Green");
    return interaction.reply({
      embeds: [successEmbed],
      ephemeral: true,
    });

    
  },
};
