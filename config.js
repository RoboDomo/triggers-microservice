module.exports = {
  weather: "weather/92211/status/observation",
  // the state of these things will be collected continuously:
  things: [
    {
      topic: "hubitat/Cabinets Switch",
      type: "switch",
      name: "Cabinets Switch"
    },
    {
      topic: "hubitat/Cabinet Controller",
      type: "switch",
      name: "Cabinet Controller"
    },
    {
      topic: "hubitat/Back Office Multisensor",
      type: "4-in-1",
      name: "Back Office Multisensor"
    },
    {
      topic: "hubitat/Back Room Switch",
      type: "switch",
      name: "Back Room Switch"
    },
    { topic: "hubitat/Back Room Fan", type: "fan", name: "Back Room Fan" },
    {
      topic: "hubitat/Bathroom Fan",
      type: "switch",
      name: "Bathroom Fan"
    },
    {
      topic: "hubitat/Toilet Fan",
      type: "switch",
      name: "Toilet Fan"
    },
    {
      topic: "hubitat/Closet Light",
      type: "dimmer",
      name: "Closet Light"
    },
    {
      topic: "hubitat/Bathroom Sensor",
      type: "motion",
      name: "Bathroom Sensor"
    },
    {
      topic: "hubitat/Bathroom Light",
      type: "dimmer",
      name: "Bathroom Light"
    },
    {
      topic: "hubitat/Bathroom Switch",
      type: "switch",
      name: "Bathroom Switch"
    },
    {
      topic: "hubitat/Hall Bath Fan",
      type: "switch",
      name: "Hall Bath Fan"
    },
    {
      topic: "hubitat/Hall Bath Lights",
      type: "switch",
      name: "Hall Bath Lights"
    },
    {
      topic: "hubitat/Hall Bath Dimmer",
      type: "dimmer",
      name: "Hall Bath Dimmer"
    },
    {
      topic: "smartthings/Outdoor Lights",
      type: "switch",
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
    { name: "Garage Doors", cls: "GarageDoor" },
    { name: "Bathroom Fans", cls: "BathroomFans" },
    { name: "Motion Lights", cls: "MotionLights" },
    { name: "Buttons", cls: "Buttons" }
  ]
};
