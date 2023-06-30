// Deploy commands to Discord
// Path: deploy-commands.js
const { Collection, Routes, PermissionFlagsBits } = require("discord.js");
const { promisify } = require("util");
const glob = require("glob");
const slashCommandParser = require("./slashCommandParser.js");

var commands = new Collection();

const config = require("../config.js");

(async () => {
  glob.sync(`src/commands/*/*.js`).forEach((cmdFile) => {
    const cmd = require(`${process.cwd()}/` + cmdFile);

    if (Array.isArray(cmd.data)) {
      cmd.data.forEach((dt) => {
        let slashCommand = slashCommandParser(dt);
        commands.set(dt.name, {
          data: slashCommand,
          guildOnly: cmd.guildOnly,
          run: cmd.run,
        });
        console.log(`[COMMANDE] -  ${dt.name}`);
      });

    } else {
      let slashCommand = slashCommandParser(cmd.data);
      commands.set(cmd.data.name, {
        data: slashCommand,
        guildOnly: cmd.guildOnly,
        run: cmd.run,
      });
      console.log(`[COMMANDE] - ${cmd.data.name}`);
    }
  });

  const { REST } = require("@discordjs/rest");
  const rest = new REST().setToken(process.env.TOKEN);
  var publicCommands = commands.filter((cmd) => !cmd.guildOnly).map((cmd) => cmd.data);
  var guildCommands = commands.filter((cmd) => cmd.guildOnly).map((cmd) => cmd.data);

  try {
    if(!config.clientId) throw new Error("Missing client ID in config.js");
    await rest.put(Routes.applicationCommands(config.clientId), { body: publicCommands });
    if(publicCommands.length > 0) { console.log(`✅ ${publicCommands.length} commandes (/) publiques ont été rechargées avec succès !`); }
    else { console.log(`Aucune commande (/) publique n'a été rechargée !`); }
    
    if(config.guildId){
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: guildCommands });
      if(guildCommands.length > 0) { console.log(`✅ ${guildCommands.length} commandes (/) de serveur ont été rechargées avec succès !`); }
      else { console.log(`Aucune commande (/) de serveur n'a été rechargée !`); }
    }
  } catch (error) {
    console.error(error);
  }
})();
