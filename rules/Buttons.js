/**
 * Responde to buttons and switches
 */

const Rule = require("../lib/Rule"),
  things = require("../lib/Things"),
  log = require("../lib/log"),
  console = require("console");

const buttons = {
  "Cabinets Switch": {
    state: "switch",
    value: "on",
    thing: things["Cabinet Controller"],
    actions: [
      { key: "switch", value: "on" },
      //      { key: "setColorMode", value: "RGB" },
      { key: "level", value: 91 },
      { key: "hue", value: 84 },
      { key: "red", value: 100 },
      { key: "green", value: 0 },
      { key: "blue", value: 100 },
      { key: "saturation", value: 33 }
    ]
  }
  //  "Back Office Multisensor": {
  //    state: "motion",
  //    value: "active",
  //    thing: things["Back Office Multisensor"],
  //    actions: [
  //      {
  //        thing: things["Back Room Switch"],
  //        key: "switch",
  //        value: "on"
  //      }
  //    ]
  //  }
};

class Buttons extends Rule {
  constructor() {
    super();
    this.things = [];
    for (const buttonKey of Object.keys(buttons)) {
      const button = buttons[buttonKey];
      const thing = things[buttonKey];
      const bt = button.thing;

      log(
        "Adding Button '" + buttonKey + "'",
        "thing: '" + thing.name + "'",
        '"' + thing.topic + '"',
        thing.state
      );
      this.things.push(thing);
      thing.on("statechange", async newState => {
        //        console.log("\n\n\nHERE ", thing.name, thing.state, "\n\n\n");
        const changed = newState[button.state];
        log(
          ">>> BUTTON statechange <<<",
          newState,
          button.state,
          changed,
          button.value
        );
        if (changed === button.value) {
          for (const action of button.actions) {
            const t = action.thing || bt;
            console.log("BUTTON action", action, bt.name, bt.topic, bt.value);
            if (changed === button.value) {
              t.change(String(action.key), String(action.value));
              t.change(String(action.key), String(action.value));
              //            await this.assure(bt, action.key, action.value);
              await this.wait(1000);
            }
          }
        }
      });
    }
  }
}

//
module.exports = Buttons;
