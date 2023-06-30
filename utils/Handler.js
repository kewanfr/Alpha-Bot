const {
  BaseInteraction,
  InteractionType,
} = require("discord.js");
const glob = require("glob");
const slashCommandParser = require("./slashCommandParser.js");

module.exports = async (client) => {
  // Events
  client.loadEvents = async () => {
    glob.sync(`src/events/*/*.js`).forEach((eventFile) => {
      const event = require(`${process.cwd()}/` + eventFile);
      if(event.disabled) return;
      if (client.config.devmode && !event.dev) return;

      // If multiple events are in the same file
      let eventsName = [];
      if (Array.isArray(event.name)) {
        eventsName = event.name;
      } else {
        eventsName.push(event.name);
      }

      eventsName.forEach((eventName) => {
        if (!eventName)
          return console.warn(
            `Evenement non-chargé: nom invalide\nFichier -> ${eventFile}`
          );


        if (event.once) {
          client.once(eventName, (...args) => event.execute(client, ...args));
        } else {
          client.on(eventName, (...args) => event.execute(client, ...args));
        }

        client.log.event(`- ${eventName}`);
      });
    });
  };

  // client.reloadEvents = async () => {
  //   client.removeAllListeners();
  //   glob.sync(`src/events/*/*.js`).forEach((eventFile) => {
  //     delete require.cache[require.resolve(`${process.cwd()}/` + eventFile)];
  //   });
  //   await client.loadEvents();
  // };
  // Events

  // Commands
  client.loadCommands = async () => {
    glob.sync(`src/commands/*/*.js`).forEach((cmdFile) => {
      const cmd = require(`${process.cwd()}/` + cmdFile);

      if (cmd.disabled) return;
      if (client.config.devmode && !cmd.dev) return;

      if (Array.isArray(cmd.data)) {
        cmd.data.forEach((dt) => {
          let slashCommand = slashCommandParser(dt);
          client.commands.set(dt.name, {
            data: slashCommand,
            guildOnly: cmd.guildOnly,
            run: cmd.run,
          });
          client.log.command(`- ${dt.name}`);
        });

      } else {
        let slashCommand = slashCommandParser(cmd.data);
        client.commands.set(cmd.data.name, {
          data: slashCommand,
          guildOnly: cmd.guildOnly,
          run: cmd.run,
        });
        client.log.command(`- ${cmd.data.name}`);
      }
    });
  };

  client.reloadCommands = async () => {
    client.commands.clear();
    glob.sync(`src/commands/*/*.js`).forEach((cmdFile) => {
      delete require.cache[require.resolve(`${process.cwd()}/` + cmdFile)];
    });
    await client.loadCommands();
  };
  // Commands

  // Components
  client.loadComponents = async () => {
    glob.sync(`src/components/*/*.js`).forEach((componentFile) => {
      let dir = `${process.cwd()}/` + componentFile;
      delete require.cache[require.resolve(dir)];
      const component = require(dir);

      if (component.disabled) return;
      if (client.config.devmode && !component.dev) return;

      client.components.set(component.name, component);
      client.log.component(
        `- ${component.name}`,
        component.type?.toUpperCase() || "COMPONENT"
      );
    });
  };

  client.reloadComponents = async () => {
    client.components.clear();
    glob.sync(`src/components/*/*.js`).forEach((componentFile) => {
      delete require.cache[
        require.resolve(`${process.cwd()}/` + componentFile)
      ];
    });
    await client.loadComponents();
  };
  // Components

  // Features
  client.loadFeatures = async () => {
    glob.sync(`src/features/*.js`).forEach((featureFile) => {
      const feature = require(`${process.cwd()}/` + featureFile);

      if (feature.disabled) return;
      if (client.config.devmode && !feature.dev) return;
      feature.execute(client);

      client.log.component(`- ${feature.name}`, "FEATURE");
    });
  };
  // Features

  client.reloadConf = async () => {
    client.log.system("Rechargement de la configuration...");
    
    delete require.cache[require.resolve("../config.js")];
    client.config = require("../config.js");

    client.log.ready("La configuration a été rechargée avec succès !");
    return true;
  };

  client.reload = async () => {
    client.log.system("Rechargement du bot...");

    delete require.cache[require.resolve("../config.js")];
    client.config = require("../config.js");

    // await client.reloadEvents();
    await client.reloadCommands();
    await client.reloadComponents();

    client.log.ready("Le bot a été rechargé avec succès !");
    return true;
  };

  await client.loadEvents();
  await client.loadCommands();
  await client.loadComponents();
  await client.loadFeatures();
};
