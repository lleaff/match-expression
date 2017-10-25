"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function strictEqualityCmp(a, b) {
  return a === b;
}

function matchExpr(value) {
  var cmp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : strictEqualityCmp;
  var result = arguments[2];

  function getCaseExpr(matched) {
    return function caseExpr() {
      if (!result && !matched) {
        for (var _len = arguments.length, cmpValues = Array(_len), _key = 0; _key < _len; _key++) {
          cmpValues[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = cmpValues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cmpValue = _step.value;

            var res = cmp(value, cmpValue);
            if (res) {
              matched = [value, cmpValue, res];
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return {
        case: getCaseExpr(matched),
        then: function thenExpr(cb) {
          if (matched) {
            result = cb.apply(undefined, _toConsumableArray(matched));
          }
          function resolve() {
            return result;
          }
          resolve.case = matchExpr(value, cmp, result).case;
          resolve.default = function (cb) {
            return result ? result : cb(value);
          };
          return resolve;
        }
      };
    };
    caseExpr.then = function () {
      return matchExpr(value, cmp, result);
    };
  }

  return {
    case: getCaseExpr(null)
  };
}

module.exports = function match(value, cmp) {
  return matchExpr(value, cmp);
};
