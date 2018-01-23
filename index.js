const Config          = require('./config'),
      schedule        = require('./lib/Schedule'),
      weather         = require('./lib/Weather'),
      things          = require('./lib/Things'),
      rules           = require('./lib/Rules'),
      console         = require('console')

function main() {
  schedule.on('each-minute', (date) => {
    console.log('each-minute', date.toLocaleString())
  })
  schedule.on('each-hour', (date) => {
    console.log('each-hour', date.toLocaleString())
  })
  schedule.on('sunrise', (date) => {
    console.log('trigger sunrise', date, weather.sunrise)
  })
  schedule.on('sunset', (date) => {
    console.log('trigger sunset', date, weather.sunset)
  })
}

main()
