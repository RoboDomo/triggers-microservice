/**
 * Bathroom Fans rule
 *
 * I have two bathrooms, and each has an exhaust fan.  I want to turn on the fan, and have it turn off after some
 * amount of time (10 minutes) if I don't turn it off manually.
 *
 * However, I want to be able to run the fan indefinitely, as when I take a shower longer than the 5 minutes.  Thus,
 * if any other lights are on in the bathroom, the timeout is disabled.
 */
const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log");

const TIMEOUT = Number(process.env.TIMEOUT) || 10 * 60 * 1000;

log("TIMEOUT", TIMEOUT);

class BathroomFans extends Rule {
  clear(name) {
    if (this.timeouts[name]) {
      log(">>>>>> CLEAR", name);
      clearTimeout(this.timeouts[name]);
    }
    this.timeouts[name] = null;
  }

  start(name) {
    try {
      const thing = this.things.get(name);

      //      console.log("> start thing", thing);
      // don't start if thing switch is off
      if (thing.state.switch === undefined || thing.state.switch === "off") {
        log(name, " Already off", name);
        this.clear(name);
        return;
      }

      // don't start if related switch(es) on
      for (const sw of this.switches[name]) {
        //        console.log("sw", sw.name, sw.state);
        if (sw.state === "on") {
          // one of the related switches is on, so we don't want to do a timer/timeout on it
          this.clear(name);
          return;
        }
      }

      if (this.timeouts[name]) {
        log("Already started", name);
        return;
      }

      // actually start the timer
      log(">>>>>>> START thing", name);
      this.clear(name);
      this.timeouts[name] = setTimeout(() => {
        this.clear(name);
        log("TIMEDOUT, assure", name, " is off");
        this.assure(name, "switch", "off", false);
      }, TIMEOUT);
    } catch (e) {
      log("name", name, e);
    }
  }

  constructor() {
    super();

    // hash map of setTimeout() handles, indexed by fan name
    this.timeouts = {};

    // these are the fans or lights that will be monitored
    this.things = new Map([
      ["Hall Bath Fan", things["Hall Bath Fan"]],
      ["Bathroom Fan", things["Bathroom Fan"]],
      ["Toilet Fan", things["Toilet Fan"]],
      ["Bathroom Light", things["Bathroom Light"]]
    ]);

    // these are the switches in the bathroom(s) that will also be monitored
    this.switches = {
      "Hall Bath Fan": [
        {
          name: "Hall Bath Dimmer",
          sw: things["Hall Bath Dimmer"],
          state: "off"
        },
        {
          name: "Hall Bath Lights",
          sw: things["Hall Bath Lights"],
          state: "off"
        }
      ],
      "Bathroom Fan": [
        {
          name: "Bathroom Light",
          sw: things["Bathroom Light"],
          state: "off"
        },
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ],
      "Bathroom Light": [
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ],
      "Toilet Fan": [
        {
          name: "Bathroom Switch",
          sw: things["Bathroom Switch"],
          state: "off"
        },
        {
          name: "Closet Light",
          sw: things["Closet Light"],
          state: "off"
        }
      ]
    };

    for (const [name, thing] of this.things) {
      // listen for other bathroom switches to monitor state
      for (const sw of this.switches[thing.name]) {
        sw.sw.on("statechange", newState => {
          sw.state = newState["switch"];
          if (newState === "on") {
            log("statechange clear", thing.name);
            this.clear(thing.name);
          } else {
            log("statechange start", thing.name);
            this.start(thing.name);
          }
        });
      }

      thing.on("statechange", newState => {
        log(thing.name, "statechange", newState);
        this.start(thing.name);
      });
    }
  }
}

//
module.exports = BathroomFans;
