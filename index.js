const { Client, Partials, Collection, Events } = require("discord.js");
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;
const ms = require("ms");

console.log("[Discord.js]", "Initializing...");

const client = new Client({
  intents: 3276799,
  partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
  allowedMentions: { parse: ["everyone", "roles", "users"] },
});

const config = require("./config.js");
client.config = config;
client.log = require("./utils/Logger.js");


process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at`, promise, `reason:`, reason);
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception:`, err);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.error(`Uncaught Exception Monitor:`, err, `origin:`, origin);
});

process.on("warning", (warn) => {
  console.warn(`Warning:`, warn);
});

client.commands = new Collection();
client.components = new Collection();
client.infos = new Collection();

require("./utils/Handler.js")(client);
require("./utils/functions/database.js")(client);
require("./utils/functions/functions.js")(client);


client.login(client.config.token);