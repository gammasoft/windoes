const windoes = require('./index')

module.exports = {
  'Will return the same array if no negatives nor a duration is passed': function (test) {
    const results = windoes({
      positives: [{
        start: '08:00',
        end: '10:00'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00',
      end: '10:00'
    }])

    test.done()
  },

  'Will return the the sum of both intervals if passed consecutive intervals but no duration': function (test) {
    const results = windoes({
      positives: [{
        start: '08:00',
        end: '10:00'
      }, {
        start: '10:00',
        end: '12:00'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00',
      end: '12:00'
    }])

    test.done()
  },

  'Will return slices of 30 minutes if passed a duration': function (test) {
    const results = windoes({
      duration: 30,
      positives: [{
        start: '08:00',
        end: '10:00'
      }, {
        start: '10:00',
        end: '12:00'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00', end: '08:29'
    }, {
      start: '08:30', end: '08:59'
    }, {
      start: '09:00', end: '09:29'
    }, {
      start: '09:30', end: '09:59'
    }, {
      start: '10:00', end: '10:29'
    }, {
      start: '10:30', end: '10:59'
    }, {
      start: '11:00', end: '11:29'
    }, {
      start: '11:30', end: '11:59'
    }])

    test.done()
  },

  'Will return slices of 1 hour if passed a duration': function (test) {
    const results = windoes({
      duration: 60,
      positives: [{
        start: '08:00',
        end: '10:00'
      }, {
        start: '10:00',
        end: '12:00'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00', end: '08:59'
    }, {
      start: '09:00', end: '09:59'
    }, {
      start: '10:00', end: '10:59'
    }, {
      start: '11:00', end: '11:59'
    }])

    test.done()
  },

  'Will return slices of 30 minutes considering the gap passed as a negative': function (test) {
    const results = windoes({
      duration: 30,
      positives: [{
        start: '08:00',
        end: '10:00'
      }, {
        start: '10:00',
        end: '12:00'
      }],

      negatives: [{
        start: '10:30',
        end: '10:59'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00', end: '08:29'
    }, {
      start: '08:30', end: '08:59'
    }, {
      start: '09:00', end: '09:29'
    }, {
      start: '09:30', end: '09:59'
    }, {
      start: '10:00', end: '10:29'
    }, /*{
      start: '10:30', end: '10:59'
    },*/ {
      start: '11:00', end: '11:29'
    }, {
      start: '11:30', end: '11:59'
    }])

    test.done()
  },

  'Will return one slice of 45 minutes and another containing the rest': function (test) {
    const results = windoes({
      duration: 45,
      positives: [{
        start: '08:00',
        end: '08:59'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00', end: '08:44'
    }, {
      start: '08:45', end: '08:59'
    }])

    test.done()
  },

  'Will return a single slice of 45 minutes and no other slice with the rest': function (test) {
    const results = windoes({
      duration: 45,
      minimumDuration: true,
      positives: [{
        start: '08:00',
        end: '08:59'
      }]
    })

    test.deepEqual(results, [{
      start: '08:00', end: '08:44'
    }])

    test.done()
  },
}