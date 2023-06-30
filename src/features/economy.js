const { Events, EmbedBuilder, roleMention, userMention } = require("discord.js");
const readline = require("readline");

module.exports = {
  name: "economy",
  disabled: false,
  dev: true,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {

    client.on(Events.MessageCreate, async (message) => {
      if(message.author.bot) return;
      if(message.channel.type === "DM") return;
      if(message.content.startsWith(client.config.prefix)) return;

      if (!await isUserBanned(interaction.user.id)) return;

      const Wallet = await getModel("Wallet");

      let userWallet = await Wallet.findOrCreate({
        where: {
          user_id: message.author.id,
        },
        defaults: {
          user_id: message.author.id,
          username: message.author.username,
        },
      });

      userWallet = userWallet[0];

      let randomMoney = Math.floor(Math.random() * 3) + 1;
      await userWallet.increment("money", { by: randomMoney });

    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if(!interaction.isButton()) return;
      if(interaction.customId == "refresh-wallet") {
        const Wallet = await getModel("Wallet");
        let userWallet = await Wallet.findOne({
          where: {
            user_id: interaction.user.id
          }
        });

        let embed = await getWalletEmbed(userWallet);

        interaction.update({
          embeds: [embed]
        });
      }
      if(interaction.customId == "refresh-bank") {
        const User = await getModel("User");
        
        let dbUser = await User.findOne({
          where: {
            user_id: interaction.user.id,
          },
        });
        bankEmbed = await getBankEmbed(dbUser);
        dashboardEmbed = await getDashboardEmbed(dbUser);
        await interaction.update({
          embeds: [dashboardEmbed, bankEmbed]
        });
      }
    });

  },
};
