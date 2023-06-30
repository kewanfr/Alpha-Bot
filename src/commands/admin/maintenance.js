const {
  EmbedBuilder,
  PermissionsBitField,
  ActivityType,
} = require("discord.js");

module.exports = {
  data: {
    name: "maintenance",
    description: "Définir le mode maintenance de la banque",
    defaultMemberPermission: PermissionsBitField.Flags.Administrator
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
    const Infos = await getModel("Infos");

    let maintenance = await Infos.findOne({
      where: {
        name: "maintenance"
      }
    });

    if(!maintenance){
      maintenance = await Infos.create({
        name: "maintenance",
        value: "0"
      });
    }

    if (maintenance.value == "1") {
      await Infos.update({
        value: "0"
      }, {
        where: {
          name: "maintenance"
        }
      });
      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Mode maintenance desactivé !`)
        .setDescription(`${emojis.non} Le mode maintenance est maintenant desactivé !`)
        .setColor("Red")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

      client.user.setPresence({
        status: "online",
        activities: [{
          name: "La kolaxx Bank",
          type: ActivityType.Watching
        }]
      });

    } else {
      await Infos.update({
        value: "1"
      }, {
        where: {
          name: "maintenance"
        }
      });

      let embed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Mode maintenance activé !`)
        .setDescription(`${emojis.oui} Le mode maintenance est maintenant activé !`)
        .setColor("Green")
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      client.user.setPresence({
        status: "dnd",
        activities: [{
          name: "en maintenance",
          type: ActivityType.Watching
        }]
      });
      client.user.setStatus('dnd');
    }
  },
};
