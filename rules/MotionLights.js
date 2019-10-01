/**
 * Turn on lights on motion
 */
const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log"),
  console = require("console");

class MotionLights extends Rule {
  constructor() {
    super();
    this.sensor = things["Bathroom Sensor"];
    this.light = things["Bathroom Light"];
    if (!this.sensor) {
      console.log("no sensor 'Bathroom Sensor'");
    }
    if (!this.light) {
      console.log("no light 'Bathroom Light'");
    }
    this.sensor.on("statechange", newState => {
      log("MOTION statechange", newState);
      if (newState.motion === "active") {
        log("motion", this.light.state);
        const state = this.light.state;
        const d = new Date(),
          h = d.getHours();
        if (state.switch === "on") {
          log("switch is already on");
          // leave it on
          //          if (h >= 21 || h < 6) {
          //            log("detected motion, overnight level 5");
          //            this.assure(this.light.name, "level", 5, false);
          //          } else {
          //            log("detected motion, daytime level 100");
          //            this.assure(this.light.name, "level", 100, false);
          //          }
        } else {
          log("Turning on", this.light.name);
          this.assure(this.light.name, "switch", "on", false);
          this.light.once("statechange", (/*newState*/) => {
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
