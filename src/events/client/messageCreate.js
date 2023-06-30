const { Events, Client, Message, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require("discord.js");
const clean = async (text) => {
  // If our input is a promise, await it before continuing
  if (text && text.constructor.name == "Promise") text = await text;

  // If the response isn't a string, `util.inspect()`
  // is used to 'stringify' the code in a safe way that
  // won't error out on objects with circular references
  // (like Collections, for example)
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });

  // Replace symbols with character code alternatives
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));

  // Send off the cleaned up result
  return text;
};

module.exports = {
  name: Events.MessageCreate,
  once: false,
  dev: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    if (message.author.bot) return;

    let prefix = client.config.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();


    if (commandName == "eval") {
      if (!client.config.users.owners.includes(message.author.id))
        return false;
      try {
        console.log(args);
        const evaled = eval(args.join(" "));
        const cleaned = await clean(evaled);
        console._log(cleaned);
        // Reply in the channel with our result
        message.channel.send({ content: `\`\`\`js\n${cleaned}\n\`\`\`` });
      } catch (error) {
        // If an error is caught, then it is logged
        console.log(error);
        message.channel.send({
          content: `\`ERROR\` \`\`\`xl\n${error}\n\`\`\``,
        });
      }
    }else if(client.config.users.owners.includes(message.author.id)) {
      let ags = message.content.slice(prefix.length).trim().split(/ +/g);
      client.execConsoleCommand(ags.join(" "), message.channel);
    }
  },
};
