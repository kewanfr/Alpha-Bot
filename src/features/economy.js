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

  },
};
