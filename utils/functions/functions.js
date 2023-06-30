module.exports = async (client) => {

  capitalize = (str) => {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  generatePassword = (length) => {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
  }

  getDiscordDate = (date) => {
    return date.toLocaleDateString();
  }

  getSlashCommandMention = (commandName) => {
    return `/${commandName}`;
  }
}