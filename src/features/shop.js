const { Events, EmbedBuilder, roleMention, userMention } = require("discord.js");
const readline = require("readline");

module.exports = {
  name: "shop",
  disabled: false,
  dev: true,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {

    client.on(Events.InteractionCreate, async (interaction) => {

      // select menu
      if (!interaction.isStringSelectMenu()) return;

      if (interaction.customId === "shopMenu") {

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

        userWallet = userWallet[0];

        let shopItems = client.config.shopItems;

        let item = shopItems.find(item => item.role == interaction.values[0]);

        if(interaction.member.roles.cache.has(item.role)) {
          let errorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.bank} Achat`)
            .setDescription(`${userMention(interaction.user.id)} ${emojis.non} Tu possèdes déjà le rôle ${roleMention(item.role)} !`
            )
            .setTimestamp()
            .setColor("Red");

          return await interaction.update({
            embeds: [errorEmbed],
            ephemeral: true
          });
        }

        if (userWallet.dataValues.money < item.price) {
          let errorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.bank} Achat`)
            .setDescription(`${userMention(interaction.user.id)} ${emojis.non} Tu n'as pas assez d'argent dans ton porte monnaie pour acheter cet item !` +
              `\n\nItem : **${item.name}**\n**Description :** ${item.description}` +
              `\nPrix de l'item : **${item.price}** ${emojis.koins} **Koins**` +
              `\n\nTon argent : **${userWallet.dataValues.money}** ${emojis.koins} **Koins**`
            )
            .setTimestamp()
            .setColor("Red");

          return await interaction.update({
            embeds: [errorEmbed],
            ephemeral: true
          });
        }

        let buyEmbed = new EmbedBuilder()
          .setTitle(`${emojis.bank} Achat`)
          .setDescription(`${userMention(interaction.user.id)} Tu as acheté le rôle **${roleMention(item.role)}** !`)
          .setTimestamp()
          .setColor("Green");

        await interaction.update({
          embeds: [buyEmbed],
          ephemeral: true
        });

        await userWallet.update({
          money: userWallet.dataValues.money - item.price
        });

        await interaction.member.roles.add(item.role);

      }


    });

  },
};
