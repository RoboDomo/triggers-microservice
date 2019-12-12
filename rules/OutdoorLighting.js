const Rule = require("../lib/Rule"),
  schedule = require("../lib/Schedule"),
  //  weather = require("../lib/Weather"),
  things = require("../lib/Things"),
  debug = require("debug")("OUTDOOR");

class OutdoorLighting extends Rule {
  constructor() {
    super();
    this.lights = things["Outdoor Lights"];
    this.sunset = false;
    schedule.on('each-minute', async () => {
      const t = this.lights;
      if (this.sunset) {
        t.change("switch", "on");
        await this.wait(1000);
        t.change("switch", "on");
        await this.wait(1000);
        t.change("switch", "on");
        await this.wait(1000);
        t.change("switch", "on");
      }
      else {
        t.change("switch", "off");
        await this.wait(1000);
        t.change("switch", "off");
        await this.wait(1000);
        t.change("switch", "off");
        await this.wait(1000);
        t.change("switch", "off");
      }
    })
    schedule.on("sunset", async () => {
      this.sunset = true;
      debug(
        new Date().toLocaleTimeString(),
        ">>>>>>>>>>>>>>,s Outdoor Lighting",
        "sunset",
        "Outdoor Lights",
        "on"
      );
      const t = this.lights;
      t.change("switch", "on");
      await this.wait(1000);
      t.change("switch", "on");
      await this.wait(1000);
      t.change("switch", "on");
//      this.assure(this.lights, "switch", "on");
    });
    schedule.on("sunrise", async () => {
      this.sunset = false;
      debug(
        new Date().toLocaleTimeString(),
        ">>>>>>>>>>>>>>>> Outdoor Lighting",
        "sunrise",
        "Outdoor Lights",
        "off"
      );
      const t = this.lights;
      t.change("switch", "off");
      await this.wait(1000);
      t.change("switch", "off");
      await this.wait(1000);
      t.change("switch", "off");
//      this.assure(this.lights, "switch", "off");
//      this.assure(this.lights, "switch", "off");
    });
  }
}

//
module.exports = OutdoorLighting;
