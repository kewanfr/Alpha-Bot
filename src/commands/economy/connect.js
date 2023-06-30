const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data:
  {
    name: "connect",
    description: "Se connecter à son compte bancaire",
    options: [
      {
        name: "mot-de-passe",
        description: "Le mot de passe de ton compte bancaire",
        type: "STRING",
        required: true,
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
    const password = interaction.options.getString("mot-de-passe");

    const User = await getModel("User");

    let dbUser = await User.findOne({
      where: {
        user_id: interaction.user.id,
      }
    });

    if(!dbUser) {
      let alreadyEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu ne possèdes pas encore de compte sur le serveur !\nUtilise ${await getSlashCommandMention("creer-compte")} pour te connecter !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyEmbed],
        ephemeral: true,
      })
    }

    if(dbUser.connected){
      let alreadyConnectedEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu es déjà connecté à ton compte !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyConnectedEmbed],
        ephemeral: true,
      })
    }

    if(dbUser.password !== password) {
      let wrongPasswordEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Le mot de passe que tu as entré est incorrect !`)
        .setTimestamp()
        .setColor("Red");
      return interaction.reply({
        embeds: [wrongPasswordEmbed],
        ephemeral: true,
      })
    }

    const getDashboard = async () => {
      
      let dashboardEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Tableau de bord`)
        .setTimestamp()
        .setColor("Blurple")
        .setDescription(
          `Bienvenue \`${interaction.user.username}\` dans le tableau de bord !\n\n` +
          `${emojis.warning} Tu seras automatiquement déconnecté dans 10 minutes !\n\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("disconnect")} pour te déconnecter manuellement !\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("bank")} pour connaitre le solde de ton compte !\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("argent")} pour connaitre le solde de ton porte-monnaie !\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("depot")} pour déposer des koins dans ton compte depuis ton porte-monnaire !\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("retrait")} pour retirer des koins de ton compte vers ton porte-monnaie !\n` +
          `${emojis.arrow} Utilise ${await getSlashCommandMention("transfert")} pour transférer des koins à un autre utilisateur !\n` 
        );

      
      await dbUser.update({
        connected: true,
        connected_at: new Date(),
      });

      return {
        embeds: [dashboardEmbed],
        components: [],
        ephemeral: true,
      };
    }

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
          await i.editReply(await getDashboard());
  
        } else if(i.customId === "refuser-reglement") {
          let declineEmbed = new EmbedBuilder()
            .setTitle(`${emojis.bank} Kolaxx Bank`)
            .setTimestamp()
            .setColor("Red")
            .setDescription(
              `${emojis.non} \`${interaction.user.username}\` tu as refusé le règlement de la **Kolaxx Bank** !\n\n` +
              `> Tu peux réessayer avec la commande ${await getSlashCommandMention("connect")} !`
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
      await interaction.reply(await getDashboard());
    }
    
    // epingler le msg mp et suppr le msg

    //bank: raffiche le règlement s'il a changé
  },
};
