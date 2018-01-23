const Rule = require('../lib/Rule'),
      schedule = require('../lib/Schedule'),
      weather = require('../lib/Weather'),
      things = require('../lib/Things')

class OutdoorLighting  extends Rule {
  constructor() {
    super()
    this.lights = things['Outdoor Lights']
    schedule.on('sunset', () => {
      console.log('Outdoor Lighting', 'sunset', 'Outdoor Lights', 'on')
      this.assure(this.lights, 'switch', 'on')
    })
    schedule.on('sunrise', () => {
      console.log('Outdoor Lighting', 'sunset', 'Outdoor Lights', 'off')
      this.assure(this.lights, 'switch', 'off')
    })
  }
}
module.exports = OutdoorLighting
