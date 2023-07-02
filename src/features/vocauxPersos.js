const {
  Events,
  EmbedBuilder,
  userMention,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
    const Vocaux = await getModel("Vocaux");

    const getConfigMessage = async (user, vocal) => {
      let voiceChannel = await client.channels.fetch(vocal.channel_id);
      let embed = new EmbedBuilder()
        .setTitle("Salon vocal personnalisé")
        .setDescription(
          `Bienvenue \`${user.username}\` dans la configuration de ton salon vocal personnalisé !\n` +
            `Tu peux configurer ton salon vocal en utilisant le menu ci-dessous.\n\n` +
            `__**Informations**__\n` +
            `**Nom du salon:** \`${vocal.name}\`\n` +
            `**Statut du salon:** \`${vocal.open ? "Ouvert" : "Fermé"}, ${
              vocal.visible ? "Visible" : "Invisible"
            }\`\n` +
            `**Limite de personnes:** \`${
              vocal.sizeLimit == 0 ? "Aucune" : vocal.sizeLimit
            }\`\n` +
            `**Personnes dans le salon:** \`${voiceChannel.members.size}\`\n` +
            `**Personnes invitées:** ${vocal.invited_users
              .split(",")
              .map((a) => (a.length > 0 ? userMention(a) : ""))}\n` +
            `**Personnes bannies:** ${vocal.banned_users
              .split(",")
              .map((a) => (a.length > 0 ? userMention(a) : ""))}`
        )
        .setColor("Blue")
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.avatarURL(),
        });

      let options = [];
      if (vocal.open) {
        options.push({
          label: "Fermer le salon",
          value: "close",
          description: "Personne ne peut rejoindre le salon vocal",
          emoji: "🔒",
        });
      } else {
        options.push({
          label: "Ouvrir le salon",
          value: "open",
          description: "Tout le monde peut rejoindre le salon vocal",
          emoji: "🔓",
        });
      }

      if (vocal.visible) {
        options.push({
          label: "Masquer le salon",
          value: "hide",
          description: "Personne ne peut voir le salon vocal",
          emoji: "👁️",
        });
      } else {
        options.push({
          label: "Afficher le salon",
          value: "show",
          description: "Tout le monde peut voir le salon vocal",
          emoji: "👁️",
        });
      }

      options.push(
        {
          label: "Inviter quelqu'un",
          value: "invite-user",
          description: "Autoriser quelqu'un à rejoindre le salon",
          emoji: "👤",
        },
        {
          label: "Expulser quelqu'un",
          value: "kick-user",
          description: "Expulser quelqu'un du salon vocal",
          emoji: "👢",
        },
        {
          label: "Renommer le salon",
          value: "rename",
          description: "Renommer le salon vocal",
          emoji: "📝",
        },
        {
          label: "Définir la limite de personnes",
          value: "setlimit",
          description: "Définir la limite de personnes dans le salon vocal",
          emoji: "👥",
        },
        {
          label: "Supprimer le salon",
          value: "delete",
          description: "Supprimer le salon vocal",
          emoji: "🗑️",
        }
      );

      let selectMenu = new StringSelectMenuBuilder()
        .setCustomId("vc-channel-action")
        .setPlaceholder("Sélectionne une action à effectuer")
        .addOptions(options);

      let row = new ActionRowBuilder().addComponents(selectMenu);
      return {
        content: `${userMention(user.id)}`,
        embeds: [embed],
        components: [row],
      };
    };

    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      if (newState.member.user.bot) return;
      if (oldState.channelId == newState.channelId) return;

      const member = newState.member;
      const guild = newState.guild;

      if (newState.channelId == client.config.channels.createChannel) {
        let voiceChannel = await newState.guild.channels.create({
          name: member.user.username,
          type: ChannelType.GuildVoice,
          parent: client.config.channels.categoryCreateChannel,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: member.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect
              ],
            }
          ],
        });
        let configChannel = await newState.guild.channels.create({
          name: member.user.username,
          type: ChannelType.GuildText,
          parent: client.config.channels.categoryCreateChannel,
          permissionOverwrites: [
            {
              id: member.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });

        let vocal = await Vocaux.create({
          user_id: member.user.id,
          channel_id: voiceChannel.id,
          guild_id: guild.id,
          config_channel_id: configChannel.id,
          name: member.user.username,
        });
        await newState.setChannel(voiceChannel);

        await configChannel.send(await getConfigMessage(member.user, vocal));
      }

      if (
        !oldState.channel ||
        oldState.channel.parentId !=
          client.config.channels.categoryCreateChannel
      )
        return;

      let vocal = await Vocaux.findOne({
        where: {
          channel_id: oldState.channel.id,
        },
      });

      if (vocal && oldState.channel.members.size == 0) {
        await oldState.channel.delete();
        let configChannel = await client.channels.fetch(
          vocal.config_channel_id
        );
        await configChannel.delete();
        await vocal.destroy();
      }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId == "vc-channel-action"
      ) {
        await interaction.deferUpdate();
        let vocal = await Vocaux.findOne({
          where: {
            config_channel_id: interaction.channelId,
          },
        });

        if (!vocal) return;

        let channel = await client.channels.fetch(vocal.channel_id);
        let user = interaction.user;

        if (!channel) return;

        switch (interaction.values[0]) {
          case "open":
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                Connect: true,
              }
            );
            await interaction.followUp({
              content:
                "✅ Le salon est désormais ouvert !\nTout le monde peut rejoindre le salon.",
              ephemeral: true,
            });
            await vocal.update({
              open: true,
            });
            await interaction.editReply(await getConfigMessage(user, vocal));
            break;

          case "close":
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                Connect: false,
              }
            );
            await interaction.followUp({
              content:
                "✅ Le salon est désormais fermé !\nPersonne ne peut rejoindre le salon.",
              ephemeral: true,
            });
            await vocal.update({
              open: false,
            });
            await interaction.editReply(await getConfigMessage(user, vocal));
            break;

          case "show":
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                ViewChannel: true,
              }
            );
            await interaction.followUp({
              content:
                "✅ Le salon est désormais visible !\nTout le monde peut voir le salon.",
              ephemeral: true,
            });
            await vocal.update({
              visible: true,
            });
            await interaction.editReply(await getConfigMessage(user, vocal));
            break;

          case "hide":
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                ViewChannel: false,
              }
            );
            await interaction.followUp({
              content:
                "✅ Le salon est désormais invisible !\nPersonne ne peut voir le salon.",
              ephemeral: true,
            });
            await vocal.update({
              visible: false,
            });
            await interaction.editReply(await getConfigMessage(user, vocal));
            break;

          case "invite-user":
            let selectUserMenu = new UserSelectMenuBuilder()
              .setCustomId("vc-channel-invite-user")
              .setPlaceholder("Utilisateurs à autoriser à rejoindre le salon")
              .setMinValues(1)
              .setMaxValues(10);

            let row = new ActionRowBuilder().addComponents(selectUserMenu);

            await interaction.followUp({
              content:
                "Choisis les personnes que tu souhaites autoriser à rejoindre le salon",
              ephemeral: true,
              components: [row],
            });
            break;

          case "kick-user":
            let selectKickUserMenu = new UserSelectMenuBuilder()
              .setCustomId("vc-channel-kick-user")
              .setPlaceholder("Utilisateurs à expulser du salon")
              .setMinValues(1)
              .setMaxValues(10);

            let rowKick = new ActionRowBuilder().addComponents(
              selectKickUserMenu
            );

            await interaction.followUp({
              content:
                "Choisis les utilisateurs que tu souhaites expulser du salon",
              ephemeral: true,
              components: [rowKick],
            });
            break;

          case "rename":
            await interaction.followUp({
              content: "Envoie le nouveau nom du salon vocal",
              ephemeral: true,
            });

            let filter = (m) => m.author.id == interaction.user.id && !m.author.bot;
            let collector = interaction.channel.createMessageCollector({
              filter,
              time: 60000,
            });

            collector.on("collect", async (m) => {
              m.delete();
              if (m.content.length > 100) {
                await interaction.followUp({
                  content:
                    "Le nom du salon ne doit pas dépasser 100 caractères",
                  ephemeral: true,
                });
                return collector.stop();
              }

              await channel.setName(m.content);
              await interaction.followUp({
                content: `✅ Le salon a été renommé en \`${m.content}\``,
                ephemeral: true,
              });
              await vocal.update({
                name: m.content,
              });
              await interaction.editReply(await getConfigMessage(user, vocal));
              return collector.stop();
            });

            collector.on("end", async (collected, reason) => {
              if (reason == "time") {
                await interaction.followUp({
                  content: "Temps écoulé, veuillez réessayer",
                  ephemeral: true,
                });
              }
            });
            break;

          case "setlimit":
            await interaction.followUp({
              content:
                "Envoie le nombre maximum de personnes que tu souhaites dans le salon vocal",
              ephemeral: true,
            });

            let filterSetLimit = (m) => m.author.id == interaction.user.id && !m.author.bot;
            let collectorSetLimit = interaction.channel.createMessageCollector({
              filterSetLimit,
              time: 60000,
            });

            collectorSetLimit.on("collect", async (m) => {
              m.delete();
              if (isNaN(m.content)) {
                await interaction.followUp({
                  content: "Veuillez envoyer un nombre valide (0 pour aucun) !",
                  ephemeral: true,
                });
                return collectorSetLimit.stop();
              }

              if (m.content > 99) {
                await interaction.followUp({
                  content:
                    "Le nombre maximum de personnes ne doit pas dépasser 99",
                  ephemeral: true,
                });
                return collectorSetLimit.stop();
              }

              await channel.setUserLimit(m.content);
              await interaction.followUp({
                content: `✅ Le nombre maximum de personnes a été défini à \`${m.content}\``,
                ephemeral: true,
              });
              await vocal.update({
                sizeLimit: m.content,
              });
              await interaction.editReply(await getConfigMessage(user, vocal));
              return collectorSetLimit.stop();
            });

            collectorSetLimit.on("end", async (collected, reason) => {
              if (reason == "time") {
                await interaction.followUp({
                  content: "Temps écoulé, veuillez réessayer",
                  ephemeral: true,
                });
              }
            });
            break;

          case "delete":
            await interaction.followUp({
              content: "Êtes-vous sûr de vouloir supprimer ce salon vocal ?",
              ephemeral: true,
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("vc-channel-delete-yes")
                    .setLabel("Oui")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("vc-channel-delete-no")
                    .setLabel("Non")
                    .setStyle(ButtonStyle.Danger)
                ),
              ],
            });
            break;

          default:
            break;
        }
      }

      if (interaction.customId == "vc-channel-invite-user") {
        await interaction.deferUpdate();
        let vocal = await Vocaux.findOne({
          where: {
            config_channel_id: interaction.channelId,
          },
        });
        let voiceChannel = interaction.guild.channels.cache.get(
          vocal.channel_id
        );

        let users = interaction.values;
        let usersIds = [];

        for (let user of users) {
          let member = interaction.guild.members.cache.get(user);
          if(!member) return await interaction.followUp({
            content: "❌ L'utilisateur n'est pas sur le serveur",
            ephemeral: true,
          });

          member.send({
            content: `Tu as été invité par \`${interaction.user.username}\` à rejoindre le salon vocal \`${voiceChannel.name}\` sur le serveur \`${interaction.guild.name}\``,
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Rejoindre")
                  .setStyle(ButtonStyle.Link)
                  .setURL(`https://discord.com/channels/${interaction.guild.id}/${voiceChannel.id}`)
              ),
            ],
          })
          usersIds.push(user);
          await voiceChannel.permissionOverwrites.edit(user, {
            Connect: true,
            ViewChannel: true,
          });
        }

        await interaction.followUp({
          content: "✅ Les utilisateurs ont été autorisés à rejoindre le salon",
          ephemeral: true,
        });
        await vocal.update({
          invited_users: usersIds.join(","),
        });
        await interaction.editReply(await getConfigMessage(interaction.user, vocal));
      }

      if (interaction.customId == "vc-channel-kick-user") {
        await interaction.deferUpdate();
        let vocal = await Vocaux.findOne({
          where: {
            config_channel_id: interaction.channelId,
          },
        });
        let voiceChannel = interaction.guild.channels.cache.get(
          vocal.channel_id
        );

        let users = interaction.values;
        let usersIds = [];

        for (let user of users) {
          usersIds.push(user);
          let member = interaction.guild.members.cache.get(user);
          if (!member.voice.channel) continue;
          await member.voice.disconnect();
          await voiceChannel.permissionOverwrites.edit(user, {
            Connect: false,
          });
        }

        await interaction.followUp({
          content: "✅ Les utilisateurs ont été expulsés du salon",
          ephemeral: true,
        });
        await vocal.update({
          banned_users: usersIds.join(","),
        });
        await interaction.editReply(await getConfigMessage(interaction.user, vocal));
      }

      if (interaction.customId == "vc-channel-delete-yes") {
        let configChannel = interaction.guild.channels.cache.get(
          interaction.channelId
        );
        let vocal = await Vocaux.findOne({
          where: {
            config_channel_id: interaction.channelId,
          },
        });
        let voiceChannel = interaction.guild.channels.cache.get(
          vocal.channel_id
        );

        await vocal.destroy();
        await voiceChannel.delete();
        await configChannel.delete();
      }

      if (interaction.customId == "vc-channel-delete-no") {
        await interaction.reply({
          content: "✅ Suppression annulée",
          ephemeral: true,
        });
      }
    });
  },
};
