const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log");

class VirtualDevices extends Rule {
  //  OFFICE TV
  officeTV() {
    const sensor = things["Office TV"];
    const tv = things["Sony 810c"];

    tv.on("statechange", async newState => {
      if (newState.power === undefined) {
        return;
      }
      if (newState.power === sensor.state.switch) {
        return;
      }
      if (newState.power === "true") {
        await this.publish("hubitat/Office TV/set/switch", "on", {
          retain: false
        });
      } else {
        await this.publish("hubitat/Office TV/set/switch", "off", {
          retain: false
        });
      }
    });

    sensor.on("statechange", async newState => {
      const st = newState.switch.toLowerCase();

      if (st === "on") {
        await this.publish("macros/run", "Office Watch TV", { retain: false });
      } else {
        await this.publish("macros/run", "Office Watch All Off", {
          retain: false
        });
      }
    });
  }

  /*******************************/

  spa() {
    const sensor = things["Autelis"];
    const spa = things["Spa"];

    spa.on("statechange", async newState => {
      if (newState.switch !== spa.switch) {
        spa.switch = newState.switch;
        await this.publish("autelis/set/spa", newState.switch);
        const hour = new Date().getHours();
        if (newState.spa === "on") {
          if (sensor.state.pooltemp < 90) {
            await this.publish("autelis/set/spaht", "on");
            if (hour > 8 && hour < 5) {
              await this.publish("autelis/set/aux3", "off");
            }
          }
        } else {
          await this.publish("autelis/set/spaht", "off");
          if (hour > 8 && hour < 5) {
            await this.publish("autelis/set/aux3", "on");
          }
        }
      }
    });

    sensor.on("statechange", async newState => {
      if (newState.spa === undefined) {
        return;
      }

      if (newState.spa !== spa.switch) {
        await this.publish("hubitat/Spa/set/switch", newState.spa);
      }
    });
  }

  waterfall() {
    const sensor = things["Autelis"];
    const waterfall = things["Waterfall"];

    waterfall.on("statechange", async newState => {
      if (newState.switch === undefined) {
        return;
      }
      if (newState.switch !== waterfall.switch) {
        waterfall.switch = newState.switch;
        await this.publish("autelis/set/aux4", newState.switch);
      }
    });

    sensor.on("statechange", async newState => {
      if (newState.switch === undefined) {
        return;
      }

      if (newState.switch !== waterfall.state.switch) {
        await this.publish("hubitat/Waterfall/set/switch", newState.aux4);
      }
    });
  }

  jets() {
    const sensor = things["Autelis"];
    const jets = things["Jets"];

    jets.on("statechange", async newState => {
      if (newState.switch === undefined) {
        return;
      }
      if (newState.switch !== jets.switch) {
        jets.switch = newState.switch;
        await this.publish("autelis/set/aux1", newState.switch);
      }
    });

    sensor.on("statechange", async newState => {
      if (newState.aux1 === undefined) {
        return;
      }

      if (newState.aux1 !== jets.state.switch) {
        log("<<< jets sensor statechange", newState.aux1, jets.state);
        if (newState.aux1 !== jets.state.switch) {
          await this.publish("hubitat/Jets/set/switch", newState.aux1);
        }
        //        jets.switch = newState.aux1;
      }
    });
  }

  heater() {
    const sensor = things["Autelis"];
    const heater = things["Spa Heat"];

    heater.on("statechange", async newState => {
      if (newState.switch !== heater.state.switch) {
        await this.publish("autelis/set/spaht", newState.switch);
      }
    });

    sensor.on("statechange", async newState => {
      if (newState.spaht === undefined) {
        return;
      }

      if (newState.spaht !== heater.state.switch) {
        //        heater.switch = newState.spaht;
        await this.publish("hubitat/Spa Heat/set/switch", newState.spaht);
      }
    });
  }

  cleaner() {
    const sensor = things["Autelis"];
    const cleaner = things["Cleaner Pump"];

    cleaner.on("statechange", async newState => {
      if (newState.switch !== cleaner.state.switch) {
        await this.publish("autelis/set/aux3", newState.switch);
      }
    });

    sensor.on("statechange", async newState => {
      if (newState.aux3 === undefined) {
        return;
      }

      if (newState.aux3 !== cleaner.state.switch) {
        //        cleaner.switch = newState.aux3;
        await this.publish("hubitat/Cleaner Pump/set/switch", newState.aux3);
      }
    });
  }

  constructor() {
    super();

    this.officeTV();
    // Autelis
    this.spa();
    this.waterfall();
    this.jets();
    this.heater();
    this.cleaner();
  }
}

//
module.exports = VirtualDevices;
