const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data:
  {
    name: "create-account",
    description: "Créer un compte bancaire"
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

    if(dbUser) {
      let alreadyEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu possèdes déjà un compte sur le serveur !\nUtilise ${await getSlashCommandMention("bank")} pour voir ton compte !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyEmbed],
        ephemeral: true,
      })
    };

    let acceptEmbed = new EmbedBuilder()
      .setTitle(`${emojis.bank} Kolaxx Bank`)
      .setTimestamp()
      .setColor("Blurple")
      .setDescription(
        `Bienvenue \`${interaction.user.username}\` dans la \`Kolaxx Bank\` !\n\n` + 
        `Afin de continuer, tu dois accepter le règlement de la **Kolaxx Bank**: \n` +
        `${emojis.arrow} **Dernière mise à jour du règlement**: **${await getLastReglementUpdate()}**\n\n` +
        `__Règlement:__\n` +
        `${await getReglement()}\n\n`
      );

    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("accept")
          .setLabel("Accepter")
          .setStyle(ButtonStyle.Success)
          .setEmoji(emojis.accept),
        new ButtonBuilder()
          .setCustomId("decline")
          .setLabel("Refuser")
          .setStyle(ButtonStyle.Danger)
          .setEmoji(emojis.decline),
      );

    let acceptMsg = await interaction.reply({
      embeds: [acceptEmbed],
      components: [row],
      ephemeral: true,
    });

    let filter = (i) => i.user.id === interaction.user.id;
    let collector = acceptMsg.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    collector.on("collect", async (i) => {
      if(i.customId === "accept") {
        const generatedPassword = await generatePassword(6);

        dbUser = await User.create({
          user_id: interaction.user.id,
          username: interaction.user.username,
          password: generatedPassword,
          accepted: true
        });
        let successEmbed = new EmbedBuilder()
          .setTitle(`${emojis.bank} Kolaxx Bank`)
          .setTimestamp()
          .setColor("Green")
          .setDescription(
            `${emojis.oui} Félicitations \`${interaction.user.username}\`, ton compte à la **Kolaxx Bank** a bien été créé !\n\n` +
            `${emojis.arrow} Tu peux voir ton compte avec la commande ${await getSlashCommandMention("bank")} !\n\n`
          );

        await dbUser.update({
          accepted: true,
        });

        await i.deferUpdate();
        await i.editReply({
          embeds: [successEmbed],
          components: [],
          ephemeral: true,
        });

      } else if(i.customId === "decline") {
        let declineEmbed = new EmbedBuilder()
          .setTitle(`${emojis.bank} Kolaxx Bank`)
          .setTimestamp()
          .setColor("Red")
          .setDescription(
            `${emojis.non} \`${interaction.user.username}\` tu as refusé le règlement de la **Kolaxx Bank** !\n\n` +
            `> Tu peux réessayer avec la commande ${await getSlashCommandMention("create-account")} !`
          );
        
        await i.deferUpdate();
        await i.editReply({
          embeds: [declineEmbed],
          components: [],
          ephemeral: true,
        });
      }
    });
  },
};
