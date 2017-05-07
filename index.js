const MINUTES_PER_DAY = (24 * 60) - 1

function padZero (number) {
  if (number < 10) {
    return '0' + number
  }

  return number.toString()
}

function timefy (minutes) {
  const seconds = parseFloat(minutes) * 60

  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds % 3600 / 60)
  ].map(padZero).join(':')
}

function minutefy (time) {
  if (time instanceof Date) {
    time = `${time.getHours()}:${time.getMinutes()}`
  }

  return time.toString()
              .trim()
              .split(':')
              .slice(0, 2)
              .reverse()
              .map((value, index) => {
                return parseFloat(value) * Math.pow(60, index)
              })
              .reduce((acc, value) => {
                return acc + value
              }, 0)
}

function sumToBase (value, array, base, options) {
  const { startProperty, endProperty } = options

  array.forEach(element => {
    let startMinute = minutefy(element[startProperty])
    let endMinute   = minutefy(element[endProperty])
    endMinute = Math.max(startMinute, endMinute)

    for (var index = startMinute; index <= endMinute; index++) {
      base[index] += value
    }
  })
}

function parseToTime (base, options) {
  const {
    minimumDuration,
    startProperty,
    endProperty,
    duration,
    debug
  } = options

  const results = []
  let interval = {
    duration: 0
  }

  function addInterval (interval) {
    if (minimumDuration && interval.duration < duration) {
      return
    }

    delete interval.duration
    results.push(interval)
  }

  function newInterval (start) {
    return { duration: 0 }
  }

  if (debug) {
    console.log('---------------------------')
    for (var index = 0; index <= MINUTES_PER_DAY; index++) {
      console.log(timefy(index) + ' | ' + (base[index] || 0))
    }
  }

  for (var index = 0; index <= MINUTES_PER_DAY; index++) {
    let start = interval[startProperty]
    let end = interval[endProperty]
    const value = base[index] || 0

    if (value > 0) {
      interval.duration++
    }

    if (value > 0 && !start && !end) {
      start = interval[startProperty] = timefy(index)
    }

    if (value > 0 && start && !end) {
      if (interval.duration === duration) {
        end = interval[endProperty] = timefy(index)
        addInterval(interval)
        interval = newInterval()
      }
    }

    if (value <= 0 && start && !end) {
      end = interval[endProperty] = timefy(index - 1)

      if (interval[startProperty] !== interval[endProperty]) {
        addInterval(interval)
      }

      interval = newInterval()
    }
  };

  return results
}

function windoes (options = {}) {
  options = Object.assign({
    positives: [],
    negatives: [],
    startProperty: 'start',
    endProperty: 'end',
    duration: Number.MAX_VALUE,
    minimumDuration: false
  }, options)

  const results = []
  const {
    positives,
    negatives,
    duration
  } = options

  const base = new Array(MINUTES_PER_DAY).fill(0)
  sumToBase( 1, positives, base, options)
  sumToBase(-1, negatives, base, options)

  return parseToTime(base, options)
}

module.exports = windoes
