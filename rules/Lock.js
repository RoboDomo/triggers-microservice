const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  console = require("console");

class Lock extends Rule {
  isUnlocked() {
    for (const sensor of this.sensors) {
      if (sensor.state.door_state !== "locked") {
        return true;
      }
    }
    return false;
  }

  constructor() {
    super();
    this.intervals = {};
    this.locks = [things["Office Lock"]];
    for (const lock of this.locks) {
      lock.on("statechange", (newState) => {
        console.log(
          new Date().toLocaleTimeString(),
          lock.name,
          "statechange",
          newState
        );
        if (newState.lock === "unlocked") {
          this.triggerUnlocked(lock);
        } else if (newState.lock === "locked") {
          this.triggerLocked(lock);
        }
      });
    }
  }

  triggerLocked(lock) {
    this.say(lock.name + " is locked");
  }

  triggerUnlocked(lock) {
    this.say(lock.name + " is unlocked");
  }
}

//
module.exports = Lock;
