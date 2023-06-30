const { Events, EmbedBuilder, roleMention, userMention, PermissionFlagsBits, ChannelType } = require("discord.js");
const readline = require("readline");

module.exports = {
  name: "vocauxPersos",
  disabled: false,
  dev: true,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {
    // quand user rejoint un certain salon vocal, créer un salon vocal avec le nom de l'user

    client.on(Events.VoiceStateUpdate, async (oldMember, newMember) => {
      if (newMember.member.user.bot) return;
      if(oldMember.channelId == newMember.channelId) return;
      if (newMember.channelId == client.config.channels.createChannel) {
        await newMember.guild.channels.create({
          name: newMember.member.user.username,
          type: ChannelType.GuildVoice,
          parent: client.config.channels.categoryCreateChannel,
          permissionOverwrites: [
            {
              id: newMember.member.user.id,
              allow: [PermissionFlagsBits.ManageChannels],
            },
            {
              id: newMember.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
      }
    });
      
  },
};
