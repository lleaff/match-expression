function strictEqualityCmp(a, b) { return a === b }

function matchExpr(value, cmp=strictEqualityCmp, result) {
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
          resolve.case = matchExpr(value, cmp, result).case
          resolve.default = (cb) => result ? result : cb(value)
          return resolve
        },
      }
    }
    caseExpr.then = () => matchExpr(value, cmp, result)
  }

  return {
    case: getCaseExpr(null)
  }
}

module.exports = function match(value, cmp) {
  return matchExpr(value, cmp)
}
