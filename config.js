module.exports = {
  weather: "weather/92211/status/now",
  // the state of these things will be collected continuously:
  things: [
    {
      topic: "smartthings/Back Office Multisensor",
      type: "4-in-1",
      name: "Back Office Multisensor"
    },
    {
      topic: "smartthings/Back Room Switch",
      type: "switch",
      name: "Back Room Switch"
    },
    { topic: "smartthings/Back Room Fan", type: "fan", name: "Back Room Fan" },
    {
      topic: "smartthings/Outdoor Lights",
      type: "fan",
      name: "Outdoor Lights"
    },
    {
      topic: "smartthings/Cart Door Sensor",
      type: "door",
      name: "Cart Door Sensor"
    },
    {
      topic: "smartthings/Garage Door Sensor",
      type: "door",
      name: "Garage Door Sensor"
    },
    { topic: "autelis/status", type: "autelis", name: "Autelis" }
  ],
  alarms: [],
  rules: [
    { name: "Outdoor Lighting", cls: "OutdoorLighting" },
    { name: "Spa", cls: "Spa" },
    { name: "Garage Doors", cls: "GarageDoor" }
  ]
};
