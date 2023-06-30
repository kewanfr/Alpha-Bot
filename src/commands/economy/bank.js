const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data:
  {
    name: "bank",
    description: "Voir le solde de ton compte"
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
    const User = await getModel("User");

    let dbUser = await User.findOne({
      where: {
        user_id: interaction.user.id,
      }
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

    let bankEmbed = await getBankEmbed(dbUser);
    let dashboardEmbed = await getDashboardEmbed(dbUser);

    let refreshButton = new ButtonBuilder()
    .setCustomId("refresh-bank")
    .setLabel("Mettre à jour")
    .setStyle(ButtonStyle.Primary);

    var msg;

    let refreshRow = new ActionRowBuilder()
      .addComponents(
        refreshButton
      );

    if(!dbUser.accepted){
      let rulesUpdatedEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(
          `${emojis.warning} Le règlement a été mis à jour depuis ta dernière connexion !\n` +
          `Tu dois accepter le nouveau règlement pour pouvoir continuer !\n\n` +
          `${emojis.arrow} **Dernière mise à jour du règlement**: **${await getLastReglementUpdate()}**\n\n` +
          `__Règlement:__\n` +
          `${await getReglement()}\n\n`
        )
        .setTimestamp()
        .setColor("Red");

      let row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("accepter-reglement")
            .setLabel("Accepter le règlement")
            .setStyle(ButtonStyle.Success)
            .setEmoji(emojis.oui),
          new ButtonBuilder()
            .setCustomId("refuser-reglement")
            .setLabel("Refuser le règlement")
            .setStyle(ButtonStyle.Danger)
            .setEmoji(emojis.non)
        );
      
      let askRulesUpdate = await interaction.reply({
        embeds: [rulesUpdatedEmbed],
        components: [row],
        ephemeral: true,
      });
      msgId = askRulesUpdate.id;
      let filter = (i) => i.user.id === interaction.user.id;
      let collector = askRulesUpdate.createMessageComponentCollector({
        filter,
        time: 120000,
      });
  
      collector.on("collect", async (i) => {
        if(i.customId === "accepter-reglement") {

          await dbUser.update({
            accepted: true
          });
          
          await i.deferUpdate();
          await i.editReply({
            embeds: [dashboardEmbed, bankEmbed],
            components: [refreshRow],
            ephemeral: true,
          });
  
        } else if(i.customId === "refuser-reglement") {
          let declineEmbed = new EmbedBuilder()
            .setTitle(`${emojis.bank} Kolaxx Bank`)
            .setTimestamp()
            .setColor("Red")
            .setDescription(
              `${emojis.non} \`${interaction.user.username}\` tu as refusé le règlement de la **Kolaxx Bank** !\n\n` +
              `> Tu peux réessayer avec la commande ${await getSlashCommandMention("bank")} !`
            );
          
          await i.deferUpdate();
          await i.editReply({
            embeds: [declineEmbed],
            components: [],
            ephemeral: true,
          });
        }
      });

    }else {
      let bankMsg = await interaction.reply({
        embeds: [dashboardEmbed, bankEmbed],
        components: [refreshRow],
        ephemeral: true,
      });
    }

    let collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      // time: 120000,
    });

    collector.on("collect", async (i) => {
      if(i.customId == "refresh-bank") {
        await i.deferUpdate();
        dbUser = await User.findOne({
          where: {
            user_id: interaction.user.id,
          }
        });
        bankEmbed = await getBankEmbed(dbUser);
        dashboardEmbed = await getDashboardEmbed(dbUser);
        await i.editReply({
          embeds: [dashboardEmbed, bankEmbed],
          components: [refreshRow],
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (i) => {
      if(i.size == 0) {
        await interaction.editReply({
          embeds: [dashboardEmbed, bankEmbed],
          components: [],
          ephemeral: true,
        });
      }
    });
      
    
    // epingler le msg mp et suppr le msg

    //bank: raffiche le règlement s'il a changé
  },
};
