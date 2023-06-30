const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
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

    let infos = await Infos.findOne({
      where: {
        name: "maintenance"
      }
    });

    if(!infos){
      infos = await Infos.create({
        name: "maintenance",
        value: false
      });
    }

    if (infos.value) {
      await Infos.update({
        value: false
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
    } else {
      await Infos.update({
        value: true
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
    }
  },
};
