const Rule = require("../lib/Rule"),
  schedule = require("../lib/Schedule"),
  //  weather = require("../lib/Weather"),
  things = require("../lib/Things"),
  debug = require("debug")("OUTDOOR");

class OutdoorLighting extends Rule {
  constructor() {
    super();
    this.lights = things["Outdoor Lights"];
    schedule.on("sunset", () => {
      debug(
        new Date().toLocaleTimeString(),
        ">>>>>>>>>>>>>>,s Outdoor Lighting",
        "sunset",
        "Outdoor Lights",
        "on"
      );
      this.assure(this.lights, "switch", "on");
    });
    schedule.on("sunrise", () => {
      debug(
        new Date().toLocaleTimeString(),
        ">>>>>>>>>>>>>>>> Outdoor Lighting",
        "sunrise",
        "Outdoor Lights",
        "off"
      );
      this.assure(this.lights, "switch", "off");
    });
  }
}

//
module.exports = OutdoorLighting;
