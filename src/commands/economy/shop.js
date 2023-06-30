const {
  EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder
} = require("discord.js");

module.exports = {
  data: {
    name: "shop",
    description: "Afficher le shop"
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

    userWallet = userWallet[0];

    let shopItems = client.config.shopItems;

    let shopEmbed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Boutique`)
      .setDescription(`Ici, tu peux acheter des items avec tes ${emojis.kcoins} **Koins** !\n\n` +
        `Tu disposes actuellement de **${userWallet.dataValues.money}** ${emojis.kcoins} **Koins** sur ton porte monnaie !`
      )
      .setTimestamp()
      .setColor("Blue");

    let shopMenu = new StringSelectMenuBuilder()
      .setCustomId("shopMenu")
      .setPlaceholder("Sélectionnez un item")
      .setMinValues(1)
      .setMaxValues(1);
    
    shopItems.forEach(i => {
      let item = {
        label: `${i.name} - ${i.price} Koins`,
        description: i.description,
        value: i.role
      };
      if(i.emoji) item.emoji = i.emoji;
      shopMenu.addOptions(
        item
      )
    });

    let row = new ActionRowBuilder()
      .addComponents(shopMenu);

    await interaction.reply({
      embeds: [shopEmbed],
      components: [row],
      ephemeral: true
    });

    
  },
};
