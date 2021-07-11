/**
 * Denon AVR rule(s)
 *
 * When the AVR goes into audio type (MS=) "Dolby Atmos", we want to set the volume to 60.
 * WHen the AVR leaves Dolby Atmos, we want to set the volume to 30.
 */

const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log");

class Atmos extends Rule {
  constructor() {
    super();
    this.mv = null;
    this.defaultVolume = "30";

    try {
      //      console.log("things", Object.keys(things));
      const thing = things["Theater AVR"];
      const vol_topic = thing.topic + "/set/MV";
      thing.on("statechange", (newState, oldState) => {
        if (newState.MV && newState.MV !== oldState.MV || newState.MS !== oldState.MS) {
          if (this.mv !== newState.MV) {
//            console.log("new volume", this.mv, newState.MV);
            this.mv = newState.MV;
//            console.log("new volume", this.mv, newState.MV);
          }
          this.mv = newState.mv;
          if (newState.MS != oldState.MS) {
            const newVol = (newState.MS.toUpperCase() === "DOLBY ATMOS")
              ? "MV60"
              : `MV${this.defaultVolume}`;

            this.publish(vol_topic+newVol.toString(), newVol);

//            console.log("newState", newState.MS, newVol);
          } else if (newState.MS && newState.MS.toUpperCase() !== "DOLBY ATMOS" && this.mv) {
//            console.log("default volume", newState.MS, this.mv);
            this.defaultVolume = this.mv;
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
