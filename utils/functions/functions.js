const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  const emojis = client.config.emojis;

  capitalize = (str) => {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  generatePassword = (length) => {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
  }

  getDiscordTimestamp = (timestamp, format = "D") => {
    return `<t:${Math.floor(timestamp / 1000)}:${format}>`;
  }

  getSlashCommandMention = (commandName) => {
    if(!client.config.slashCommands[commandName]) return `/${commandName}`;
    return `</${commandName}:${client.config.slashCommands[commandName]}>`;
  }

  getBankEmbed = async (dbUser) => {
    return new EmbedBuilder()
    .setTitle(`${emojis.bank} Kolaxx Bank`)
    .setDescription(`Voici le solde de ton compte !\n\n${emojis.koins} **${dbUser.bank} Koins**`)
    .setTimestamp()
    .setColor("Blurple");
  }

  getDashboardEmbed = async (dbUser) => {
    return new EmbedBuilder()
      .setTitle(`${emojis.bank} Compte`)
      .setTimestamp()
      .setColor("Blurple")
      .setDescription(
        `Bienvenue \`${dbUser.username}\` dans ton compte !\n\n` +
        `${emojis.arrow} Utilise ${await getSlashCommandMention("bank")} pour connaitre le solde de ton compte !\n` +
        `${emojis.arrow} Utilise ${await getSlashCommandMention("argent")} pour connaitre le solde de ton porte-monnaie !\n\n` +
        `${emojis.arrow} Utilise ${await getSlashCommandMention("depot")} pour déposer des ${emojis.koins} **Koins** dans ton compte depuis ton porte-monnaie !\n` +
        `${emojis.arrow} Utilise ${await getSlashCommandMention("retrait")} pour retirer des koins de ton compte vers ton porte-monnaie !\n` +
        `${emojis.arrow} Utilise ${await getSlashCommandMention("pay")} pour transférer des koins à un autre utilisateur !\n` 
      );
  },

  getWalletEmbed = async (userWallet) => {
    return new EmbedBuilder()
      .setTitle(`${emojis.bank} Kolaxx Bank`)
      .setDescription(
        `${emojis.arrow} **Solde de ton porte monnaie:** **${userWallet.dataValues ? userWallet.dataValues.money : userWallet.money}** ${emojis.koins} **Koins**\n\n` +
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
}