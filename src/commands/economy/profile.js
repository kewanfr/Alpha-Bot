const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "profil",
    description: "Voir ton profil",
    options: [
      {
        name: "user",
        description: "L'utilisateur a voir",
        type: "USER",
        required: false,
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
    let user = interaction.options.getUser("user") || interaction.user;
    let wallet = await Wallet.findOne({
      where: {
        user_id: user.id
      }
    });
    if (!wallet) {
      
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Profil de ${user.username}`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` n'a pas de porte monnaie !`)
        .setColor("Red")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } else {

      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Profil de ${user.username}`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a **${wallet.money}** ${emojis.kcoins} **Koins** dans son porte monnaie !`)
        .setColor("Green")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    }
    
  },
};
