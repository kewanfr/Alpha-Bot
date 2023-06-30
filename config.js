require("dotenv").config();

var config = {
  devmode: process.env.DEV_MODE === "true" ? true : false,
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  prefix: process.env.PREFIX ?? "!",

  users: {
    owners: [],
    developers: [],
  },
  
  channels: {},
  emojis: {
    bank: "<:Bank:1124300544429805690>",
    arrow: "➜",
    accept: "✅",
    decline: "<:Warning:1124301508482191411>",
    warning: "<:Warning:1124301508482191411>",
    key: "<:Key:1124300754501505065>",
    kcoins: "<:Koins:1124303383264776242>",
    top: "<:Top:1124303380676882433>",
    text: "<:Text:1124302109437870192>",
    oui: "<:Oui:1124325393550278769>",
    non: "<:Non:1124325395693576275>",
    question: "<:Question:1124325396998000690>"
  },
  images: {},

  slashCommands: {
    "creer-compte": "1124297435745898527",
    "connect": "1124332874989056010",
    "disconnect": "1124342353822486622",
  },
};

let reglement = `${config.emojis.arrow} La triche est **interdite**\n` +
`${config.emojis.arrow} Il est interdit de faire des **paris**\n` +
`${config.emojis.arrow} Il est interdit d'utiliser un **double compte** pour obtenir des ${config.emojis.kcoins} **Koins**\n` +
`${config.emojis.arrow} Vous ne pouvez pas **supprimer votre compte** ni **changer de mot de passe**\n` +
`${config.emojis.arrow} Tout manquement à une de ces règles serra passible d'un **banissement**\n` +
`${config.emojis.arrow} En cas de problème, contactez un __membre du staff__`;

config.reglement = reglement;

module.exports = config;