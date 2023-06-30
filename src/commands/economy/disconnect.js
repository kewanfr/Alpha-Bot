const { EmbedBuilder } = require("discord.js");

module.exports = {
  data:
  {
    name: "disconnect",
    description: "Se déconnecter de son compte"
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
        .setDescription(`${emojis.warning} Tu ne possèdes pas encore de compte sur le serveur !\nUtilise ${await getSlashCommandMention("creer-compte")} pour te connecter !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyEmbed],
        ephemeral: true,
      })
    }

    if(!dbUser.connected){
      let alreadyConnectedEmbed = new EmbedBuilder()
        .setTitle(`${emojis.bank} Kolaxx Bank`)
        .setDescription(`${emojis.warning} Tu n'est connecté à aucun compte !`)
        .setTimestamp()
        .setColor("Orange");
      return interaction.reply({
        embeds: [alreadyConnectedEmbed],
        ephemeral: true,
      })
    }

    await dbUser.update({
      connected: false,
    });
    
    let disconnectedEmbed = new EmbedBuilder()
    .setTitle(`${emojis.bank} Kolaxx Bank`)
    .setDescription(`${emojis.oui} Tu t'es bien déconnecté de ton compte !`)
    .setTimestamp()
    .setColor("Green");
    return interaction.reply({
      embeds: [disconnectedEmbed],
      ephemeral: true,
    });
  },
};
