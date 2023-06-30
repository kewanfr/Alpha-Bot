const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "top",
    description: "Voir le classement de l'économie",
    options: [
      {
        name: "type",
        description: "Le type de classement",
        type: "STRING",
        required: true,
        choices: [
          {
            name: "Bank",
            value: "bank"
          },
          {
            name: "Wallet",
            value: "wallet"
          }
        ]
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

    let type = interaction.options.getString("type") ?? "bank";
    var description = "";

    let embed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Classement de l'économie`)
      .setColor("Blue")
      .setTimestamp();
    if (type == "bank") {
      const users = await User.findAll({
        order: [["bank", "DESC"]]
      });

      if(users.length == 0) description = "Aucun utilisateur n'a encore de compte en banque !";
      
      for (let i = 0; i < users.length; i++) {
        let user = client.users.cache.get(users[i].user_id);
        description += `**${i + 1}.** \`${user.username}\` - **${users[i].bank}** ${emojis.koins} **Koins**\n`;
      }
      embed.setDescription(
        `${emojis.oui} Voici le classement **de la banque** :\n\n${description}`
      );
      return interaction.reply({
        embeds: [embed]
      });
    } else if (type === "wallet") {
      const wallets = await Wallet.findAll({
        order: [["money", "DESC"]]
      });

      if(wallets.length == 0) description = "Aucun utilisateur n'a encore de porte monnaie !";
      
      for (let i = 0; i < wallets.length; i++) {
        let user = client.users.cache.get(wallets[i].user_id);
        description += `**${i + 1}.** \`${user.username}\` - **${wallets[i].money}** ${emojis.koins} **Koins**\n`;
      }
      embed.setDescription(
        `${emojis.oui} Voici le classement **des portes monnaies** :\n\n${description}`
      );
      return interaction.reply({
        embeds: [embed]
      });
    }

  },
};
