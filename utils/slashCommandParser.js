const {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} = require("@discordjs/builders");

function optionBuilderFromObject(optionObject) {
  switch (optionObject.type) {
    case "SUB_COMMAND": {
      let subCommandBuilder = new SlashCommandSubcommandBuilder()
        .setName(optionObject.name)
        .setDescription(optionObject.description);

      optionObject.options.forEach((option) => {
        subCommandBuilder =
          optionBuilderFromObject(option).applyTo(subCommandBuilder);
      });

      return {
        applyTo: (commandOrGroup) =>
          commandOrGroup.addSubcommand((subCommand) => subCommandBuilder),
      };
    }

    case "SUB_COMMAND_GROUP": {
      let subCommandGroupBuilder = new SlashCommandSubcommandGroupBuilder()
        .setName(optionObject.name)
        .setDescription(optionObject.description);

      optionObject.options.forEach((option) => {
        subCommandGroupBuilder = optionBuilderFromObject(option).applyTo(
          subCommandGroupBuilder
        );
      });

      return {
        applyTo: (command) =>
          command.addSubcommandGroup((group) => subCommandGroupBuilder),
      };
    }

    default: // string, integer, boolean, user, channel, role, mentionable, number
      return {
        applyTo: (commandOrGroupOrSubCommand) => {
          let optionBuilder = commandOrGroupOrSubCommand[
            "add" +
              optionObject.type.charAt(0).toUpperCase() +
              optionObject.type.slice(1).toLowerCase() +
              "Option"
          ]((option) => {
            let optionSetup = option
              .setName(optionObject.name)
              .setDescription(optionObject.description)
              .setRequired(optionObject.required);

            if(optionObject.min_value) optionSetup = optionSetup.setMinValue(optionObject.min_value);
            if(optionObject.max_value) optionSetup = optionSetup.setMaxValue(optionObject.max_value);

            if (
              optionObject.choices &&
              (optionObject.type === "STRING" ||
                optionObject.type === "INTEGER")
            ) {
              optionObject.choices.forEach((choice) => {
                optionSetup.addChoices(choice);
              });
            }

            return optionSetup;
          });
          return optionBuilder;
        },
      };
  }
}

function commandBuilderFromObject(commandObject) {
  let commandBuilder = new SlashCommandBuilder()
    .setName(commandObject.name)
    .setDescription(commandObject.description);

  if (commandObject.defaultMemberPermission) {
    commandBuilder.setDefaultMemberPermissions(commandObject.defaultMemberPermission);
  }

  if (commandObject.options) {
    commandObject.options.forEach((option) => {
      commandBuilder = optionBuilderFromObject(option).applyTo(commandBuilder);
    });
  }
  return commandBuilder;
}

module.exports = commandBuilderFromObject;
