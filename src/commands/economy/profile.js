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
    const User = await getModel("User");
    let user = interaction.options.getUser("user") || interaction.user;
    let wallet = await Wallet.findOne({
      where: {
        user_id: user.id
      }
    });

    let dbUser = await User.findOne({ where: { user_id: user.id } });
    if (!dbUser) {
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Profil de ${user.username}`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` n'a pas de compte en banque !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    if (!wallet) {
      
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Profil de ${user.username}`)
        .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` n'a pas de porte monnaie !`)
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    }

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Profil de ${user.username}`)
      .setDescription(`${emojis.oui} L'utilisateur \`${user.username}\` a **${wallet.money}** ${emojis.koins} **Koins** dans son porte monnaie !\n`
      + `Il a **${dbUser.bank}** ${emojis.koins} **Koins** sur son compte !\n` +
      `Il a **${wallet.money + dbUser.bank}** ${emojis.koins} **Koins** en tout !` +
      `\n\n__Description__: ${dbUser.description ?? "L'utilisateur n'a pas de description"}` 
      )
      .setColor("Green")
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
      
    
  },
};
