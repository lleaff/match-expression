# Match expression
[![npm](https://img.shields.io/npm/v/match-expression.svg)](https://www.npmjs.com/package/match-expression)
[![Build Status](https://travis-ci.org/lleaff/match-expression.svg?branch=master)](https://travis-ci.org/lleaff/match-expression)

A flexible switch/match expression utility for Javascript.

```javascript
import match from 'match-expression'

const x = match('bar')
  .case('foo')
    .then(() => 'FOO')
  .case('bar')
  .case('baz')
    .then(() => 'BARBAZ')
  .default(() => 'DEFAULT)')

// x === 'BARBAZ'
```

### Custom comparison function

Apply and get regular expression capture group matches in one go:

```javascript
const inputUrl = "http://eat-frogs.io/dishes/parmigiana-di-rana"

function regexMatch(str, regex) { return regex.exec(str) }

const httpsUrl = match(inputUrl, regexMatch)
  .case(/^http:\/\/(.*)/)
    .then((url, _, [, noprotocol]) => `https://${noprotocol}`)
  .case(/^\//)
    .then(url => `https://${DOMAIN}${url}`)
  .default(url => url)

// httpsUrl === "https://eat-frogs.io/dishes/parmigiana-di-rana"
```

### No default clause

Execute the function returned by `then` to resolve to a value without having to use a `default` clause.

```javascript
match(person.type)
  .case('HUMAN').then(() => greet(person))
  .case('NOT_HUMAN').then(() => eat(person))()
```

### [Interactive examples](https://npm.runkit.com/match-expression)

## API

### `match( value [, comparisonFunction] )`
**`value`**`: any`  
  The *value* to be matched against the subsequent *case*s.  
**`comparisonFunction`**`: (value, caseValue) => any` (*optional*)  
   Defaults to strict equality (`===`).  
   It is passed the initial value as first argument and the comparing value as second. If its result is truthy, then the initial value is interpreted as matching the comparing value.  
   Its result with the matching value is used a the third argument to the matching `then` clause.  
   Once a value has matched, the comparison function is not called anymore.  
**Returns**`: { case }`  
   An object with a `.case` method.

### `.case( comparisonValue [, ...] )`
_Available after `match` and `case` clauses._  
**`comparisonValue`**`: any`  
  The value(s) to compare with the initial value provided to `match`. The actual matched value will be passed as second argument to `then` handler.  
**Returns**`: { then, case }`  
   An object with `.then` and `.case` methods.  
  
### `.then( callback )`
_Available after `case` clauses._  
**`callback`**`: (value, matchedValue, comparisonFunctionResult) => any`  
  Executed only if a previous `case` clause matched, in which case its return value will be used as the return value of the match expression.  
  The first argument is the initial value, the second is the matching *case* value, the third one is the result of the call to the comparison function with the two previous arguments (defaults to `true` if no custom `comparisonFunction` was provided).  
**Returns**`: [Callable: () => result]{ case, default }`  
  A callable object with `.case` and `.default` methods.  
  The function can be called to resolve the match directly, without a "`default`" clause.
  
### `.default( callback )`
_Available after `then` clauses._  
**`callback`**`: (value) => any`  
  Executed only if no previous `case` clause matched, in which case its return value will be used as the return value of the match expression. 
  The first argument is the initial value.  
**Returns**`: any`  
  Returns resolved value from `then` clause callback corresponding to the matched `case` clause, or from its own callback if no `case` matched.
  
## Notes

* Checkout [`./test.js`](test.js) for an exhaustive spec.
* Before writing this package I wasn't particularly fond of the builder-style API, so I wrote another match expression module that had a more data-oriented API. The configuration was made through a big array passed to `match`:  
  `match: (value, [ ...cases, default ])`  
  where `cases: [ [ ...caseValues, callback ] ]` and `default: [ callback ]`.  
  Turns out that it's very unreadable for anything non-trivial. So in case the builder style API is an initial turn off for you, put yourself in the shoes of someone reading your code: the _case_, _then_ and _default_ visual keywords are very helpful in making the code more understandable.
* Related: [if-exp](https://www.npmjs.com/package/if-exp)
