const Things = require('./Things')

class Rule {
  /**
   * Assure the thing is set to setting
   *
   * Retry once a second until the setting sticks
   */
  assure(thing, key, value) {
    const t = Things[thing] || thing
    if (!t || !t.state || !t.state[key]) {
      return
    }
    if (t.state[key] !== value) {
      t.change(key, value)
      const timer = setInterval(() => {
        if (t.state[key] === value) {
          clearInterval(timer)
        }
        else {
          t.change(key, value)
        }
      }, 1000)
    }
  }
}
module.exports = Rule
