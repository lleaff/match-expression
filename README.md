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
### Custom comparison callback

Apply and get regular expression capture group matches in one go:

```javascript
const inputUrl = "http://eat-frogs.io/dishes/parmigiana-di-rana"

const httpsUrl = match(inputUrl, (str, regex) => regex.exec(str))
  .case(/^http:\/\/(.*)/)
    .then((url, _, [, noprotocol]) => `https://${noprotocol}`)
  .case(/^\//)
    .then(url => `https://${DOMAIN}${url}`)
  .default(url => url)

// httpsUrl === "https://eat-frogs.io/dishes/parmigiana-di-rana"
```

### No default clause

Execute the function returned by `then` to resolve to a value without having a `default` clause.

```javascript
match(person.type)
  .case('HUMAN').then(() => greet(person))
  .case('NOT_HUMAN').then(() => eat(person))()
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
  

* Checkout [`test.js`](test.js) for an exhaustive spec.
