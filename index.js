function strictEquality(a, b) { return a === b }

function match(value, cmp=strictEquality, result) {
  function getCaseExpr(matched) {
    return function caseExpr(...cmpValues) {
      if (!result && !matched) {
        for (const cmpValue of cmpValues) {
          const res = cmp(value, cmpValue)
          if (res) {
            matched = [value, cmpValue, res]
            break
          }
        }
      }
      return {
        case: getCaseExpr(matched),
        then: function thenExpr(cb) {
          if (matched) {
            result = cb(...matched)
          }
          function resolve() {
            return result
          }
          resolve.case = match(value, cmp, result).case
          resolve.default = (cb) => result ? result : cb(value)
          return resolve
        },
      }
    }
    caseExpr.then = () => match(value, cmp, result)
  }

  return {
    case: getCaseExpr(null)
  }
}

module.exports = match
