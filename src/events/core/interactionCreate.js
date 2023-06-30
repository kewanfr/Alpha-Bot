const { BaseInteraction, InteractionType, ModalBuilder, ModalSubmitFields, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  dev: true,
  /**
   *
   * @param {BaseInteraction} interaction
   */
  execute: async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      client.log.exec(
        `${command.data.name} exécutée par ${interaction.user.tag} sur ${
          interaction.guild ? interaction.guild.name : "DM"
        }`,
        "CMD"
      );

      try {
        await command.run(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "❌ Une erreur est survenue lors de l'exécution de cette commande !",
          ephemeral: true,
        });
      }
    } else if (interaction.isContextMenuCommand()) {
      const contextMenu = client.commands.get(interaction.commandName);
      if (!contextMenu) return;

      client.log.exec(
        `${contextMenu.data.name} exécutée par ${interaction.user.tag} sur ${
          interaction.guild ? interaction.guild.name : "DM"
        }`,
        "CONTEXT"
      );

      try {
        await contextMenu.run(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "❌ Une erreur est survenue lors de l'exécution de cette commande !",
          ephemeral: true,
        });
      }
    }

      const component =
        client.components.get(interaction.customId) ||
        client.components.find((m) =>
          m.data.name.includes(interaction.customId)
        );
      if (!component) return;

      client.log.exec(
        `${component.name} exécuté par ${interaction.user.tag} sur ${
          interaction.guild ? interaction.guild.name : "DM"
        }`,
        "COMPONENT"
      );

      try {
        await component.run(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "❌ Une erreur est survenue lors de l'exécution de cette commande !",
          ephemeral: true,
        });
      }
  },
};
