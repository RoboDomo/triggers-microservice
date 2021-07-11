/**
 * Denon AVR rule(s)
 *
 * When the AVR goes into audio type (MS=) "Dolby Atmos", we want to set the volume to 60.
 * WHen the AVR leaves Dolby Atmos, we want to set the volume to 30.
 */

const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log");

const ATMOS = "DOLBY ATMOS";

class Atmos extends Rule {
  constructor() {
    super();
    this.mv = "30";
    this.ms = null;

    try {
      //      console.log("things", Object.keys(things));
      const thing = things["Theater AVR"];
      const vol_topic = thing.topic + "/set/MV";
      thing.on("statechange", (newState, oldState) => {
        if (newState.MS && oldState.MS) {
          if (
            newState.MV != this.mv &&
            (
              this.ms != ATMOS &&
              newState.MS.toUpperCase() !== ATMOS &&
              oldState.MS.toUpperCase() !== ATMOS
            )
          ) {
            this.mv = newState.MV;
            console.log(
              "new volume",
              this.mv,
              this.ms,
              newState.MS,
              oldState.MS,
            );
          }
          if (newState.MS != this.ms) {
            this.ms = newState.MS;
            console.log("statechange", this.ms, newState.MS, oldState.MS);
            if (newState.MS.toUpperCase() === ATMOS) {
              console.log("new state ATMOS");
              this.publish(vol_topic + "MV60", "MV60");
            } else {
              console.log("new state NOT ATMOS", oldState.MS.toUpperCase());
              if (oldState.MS.toUpperCase() === ATMOS) {
                this.publish(vol_topic + "MV" + this.mv, "MV" + this.mv);
              }
            }
          }
        }

        //        console.log("STATECHANGE");
      });
    } catch (e) {
      console.log("E", e);
    }
    //    console.log("x");
  }
}

//
module.exports = Atmos;
