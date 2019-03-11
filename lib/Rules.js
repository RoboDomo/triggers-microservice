const Config = require("../config");

class Rules {
  constructor() {
    console.log("construct Rules");
    Config.rules.forEach(rule => {
      console.log("new rule " + rule.cls);
      const Class = require("../rules/" + rule.cls);
      this[rule.name] = new Class();
    });
  }
}
module.exports = new Rules();
