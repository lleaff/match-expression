# Match expression
[![npm](https://img.shields.io/npm/v/match-expression.svg)](https://www.npmjs.com/package/match-expression)

A flexible switch/match expression utility for Javascript.

```javascript
import match from 'match-expression'

const x = match('foo')
  .case('foo')
  .case('bar')
    .then(() => 'FOOBAR')
  .case('baz')
    .then(() => 'BAZ')

// x === 'FOOBAR'
```
### RegExp matching
Apply and get regular expression capture group matches in one go:

```javascript
const inputUrl = "http://eat-frog.io/dishes/parmigiana-di-rana"

const httpsUrl = match(inputUrl, (str, regex) => regex.exec(str))
  .case(/^https:\/\//)
    .then(url => url)
  .case(/^http:\/\/(.*)/)
    .then((url, _, [, noprotocol]) => 'https://' + noprotocol)
  .case(/^\//)
    .then(url => 'https://' + DOMAIN + url)
  .default(url => url)

// httpsUrl === "https://eat-frog.io/dishes/parmigiana-di-rana"
```

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

### `.case(comparisonValue, ...)`
**`comparisonValue`**`: any|[any]`  
  The value(s) to compare with the initial value provided to `match`.  
**Returns**`: { then, case }`  
   An object with `.then` and `.case` methods.  
  
### `.case(...).then(callback)`
**`callback`**`: (value, matchedValue, comparisonFunctionResult) => any`  
  Executed only if a previous `case` clause matched, in which case its return value will be used as the return value of the match expression.  
  The first argument is the initial value, the second is the matching *case* value, the third one is the result of the call to the comparison function with the two previous arguments (defaults to `true` if no custom `comparisonFunction` was provided).
**Returns**`: [Callable: () => result]{ case, default }`  
  A callable object with `.case` and `.default` methods.  
  The function can be called to resolve the match directly, without a "`default`" clause.
  
### `.then(...).default(callback)`
**`callback`**`: (value) => any`  
  Executed only if no previous `case` clause matched, in which case its return value will be used as the return value of the match expression. 
  The first argument is the initial value.
  
* Checkout [test.js](`test.js`) for an exhaustive spec.
