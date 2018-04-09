const generateUniqueId = (parentObject = {}, prefix = 'id-', numDigits = 4) => {
  const createID = (prefix, number) => `${prefix}${number.toString().padStart(numDigits, '0')}`
  const max = +(`1${'0'.padStart(numDigits, 0)}`)
  let numberId = Math.floor(Math.random() * max)
  let numIterations = 0
  let currentId = createID(prefix, numberId)
  while (parentObject[currentId] && numIterations < max) {
    numberId = Math.floor(Math.random() * max)
    currentId = createID(prefix, numberId)
    numIterations++
  }

  if (!parentObject[currentId]) {
    return currentId
  } else {
    return generateUniqueId(parentObject, `${currentId}-`, numDigits)
  }
}

export default {
  projectIds: state => Object.keys(state.projects),
  newProjectId: state => Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
  projectById: state => id => state.projects[id],
  isLoggedIn: state => !!state.accountData,
  isDevelopmentMode: state => !!state.developmentMode,
  currentUser: state => state.accountData,
  memberById: state => id => state.members[id],
  generateUniqueId: state => generateUniqueId
}
