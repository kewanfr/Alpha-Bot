module.exports = async (client) => {

  capitalize = (str) => {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}