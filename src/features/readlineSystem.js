const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const readline = require("readline");

// Système de commandes dans la console du bot

const clean = async (text) => {
  if (text && text.constructor.name == "Promise") text = await text;
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  return text;
};

module.exports = {
  name: "readlineSystem",
  disabled: false,
  dev: true,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {

    client.execConsoleCommand = async (command, chann = false) => {
      let input = command.toLowerCase();
      let message = "";

      let commandName = input.split(" ")[0];
      switch (commandName) {
        
        case "help":
          console.log(`Commandes disponibles :
              - help => Affiche ce message
              - reload => Recharge le bot
              - reloadConf => Recharge la configuration

              - deploy => Déploie les commandes
              - stop/restart => Arrête le bot
              - eval => Évalue du code
              `)
              
          break;

        case "reloadconf":
          client.reloadConf();
          message = "✅ Configuration rechargée !";
          break;

        case "reload":
          client.reload();
          message = "✅ Bot rechargé !";
          break;

        case "deploy":
          require("../../utils/deploy-commands");
          message = "✅ Commandes déployées !";
          break;

        case "restart":
        case "stop":
          if(chann) await chann.send({ content: "🛠 Redémarrage du bot..." });
          // await wait(1000);
          client.log.system("🛠 Redémarrage du bot...");
          rl.close();
          process.exit(0);
          break;

        case "eval":
          let code = input.replace("eval ", "");
          try {
            const evaled = eval(code);
            const cleaned = await clean(evaled);
            console._log(cleaned);
          } catch (error) {
            console.log(error);
          }
          break;

        default:
          console.log("Commande inconnue. Faites help pour afficher les commandes disponibles.");
          break;
      }
      if(message.length > 0) {
        console.log(message);
        if(chann) await chann.send({ content: message });
      }
    };

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", async (input) => {
      client.execConsoleCommand(input);
    });
  },
};
