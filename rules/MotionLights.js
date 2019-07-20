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
      log("MOTION statechange", newState);
      if (newState.motion === "active") {
        console.log("motion", this.light.state);
        const state = this.light.state;
        const d = new Date(),
          h = d.getHours();
        if (state.switch === "on") {
          if (h >= 21 || h < 6) {
            log("detected motion, overnight level 5");
            this.assure(this.light.name, "level", 5, false);
          } else {
            log("detected motion, daytime level 100");
            this.assure(this.light.name, "level", 100, false);
          }
        } else {
          this.assure(this.light.name, "switch", "on", false);
          this.light.once("statechange", newState => {
            if (h >= 21 || h < 6) {
              log("detected motion, overnight level 5");
              this.assure(this.light.name, "level", 5, false);
            } else {
              log("detected motion, daytime level 100");
              this.assure(this.light.name, "level", 100, false);
            }
          });
        }
      }
    });
  }
}

//
module.exports = MotionLights;
