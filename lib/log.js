const console = require("console");

const log = (...args) => {
  const d = new Date();
  console.log(d.toLocaleTimeString(), ...args);
};

module.exports = log;
