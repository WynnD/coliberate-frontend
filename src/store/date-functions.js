
// input must be parseable by new Date() contructor
function getDateRange (start = new Date(), end = new Date()) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${startDate.toDateString()} to ${endDate.toDateString()}`
}

function getFormattedDate (date) {
  let [year, month, day] = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    (date.getDate()).toString().padStart(2, '0')
  ]

  return `${year}-${month}-${day}`
}

function getDateDifference (older, newer) {
  const difference = new Date(Math.abs(new Date(newer) - new Date(older)))
  const attributes = {
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  }

  // conversion from this to milliseconds
  const constants = {
    millisecond: 1,
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
  }

  const divide = (numerator, denominator) => {
    return {
      quotient: parseInt(numerator / denominator),
      remainder: numerator % denominator
    }
  }

  // convert time in ms to various attributes
  let total = difference.getTime()
  Object.keys(attributes)
    .forEach((attr) => {
      if (total > constants[attr]) {
        const { quotient, remainder } = divide(total, constants[attr])
        attributes[attr] = quotient
        total = remainder
      }
    })
  return attributes
}

function getDateDifferenceMessage (older, newer) {
  const attributes = getDateDifference(older, newer)
  return Object.keys(attributes)
    .filter(attr => attributes[attr] > 0)
    .map(attr => {
      const value = attributes[attr]
      return `${value} ${value === 1 ? attr : `${attr}s`}`
    }).join(', ')
}

function getRelativeDateDifferenceMessage (inputDate, ignoredAttributes = []) {
  const currentDate = new Date()
  const attributes = getDateDifference(currentDate, new Date(inputDate))
  const msg = Object.keys(attributes)
    .filter(attr => ignoredAttributes.indexOf(attr) === -1 && attributes[attr] > 0)
    .map(attr => {
      const value = attributes[attr]
      return `${value} ${value === 1 ? attr : `${attr}s`}`
    })

  return msg[0] ? `${msg[0]} ${new Date(inputDate) - currentDate < 0 ? 'ago' : 'from now'}` : 'Now'
}

export default {
  getDateDifference,
  getDateDifferenceMessage,
  getRelativeDateDifferenceMessage,
  getDateRange,
  getFormattedDate
}
