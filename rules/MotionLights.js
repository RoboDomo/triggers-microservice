/**
 * Turn on lights on motion
 */
const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log");

class MotionLights extends Rule {
  constructor() {
    super();
    this.sensor = things["Bathroom Sensor"];
    this.light = things["Bathroom Light"];
    this.sensor.on("statechange", newState => {
      log("statechange", newState);
      if (newState !== "inactive") {
        if (this.light.state.switch === "off") {
          const d = new Date(),
            h = d.getHours();
          this.assure(this.light.name, "switch", "on");
          if (h >= 21 || h < 6) {
            log("detected motion, overnight level 5");
            this.assure(this.light.name, "level", 5);
          } else {
            log("detected motion, daytime level 100");
            this.assure(this.light.name, "level", 100);
          }
        }
      }
    });
  }
}

//
module.exports = MotionLights;
