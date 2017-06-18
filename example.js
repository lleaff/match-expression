const match = require('match-expression')

const a = match('bar')
  .case('foo')
    .then(() => 'FOO')
  // You can chain .case clauses to associate multiple cases to the
  // same then callback.
  .case('bar')
  .case('baz') 
    .then(() => 'BARBAZ')
  .default(() => 'DEFAULT')

console.log(a)

//------------------------------------------------------------

const maleNames = [ 'luke', 'carl', 'louis' ]

let userName = 'carla'

const genderResolution = match(userName, (name, test) => name.match(test))
  // You can also pass multiple arguments to a single .case. In both cases, the
  // second argument passed to .then will be the value that caused the match.
  .case(/la$/)
    .then((name, matched) =>
      `User ${name} was determined to be female (name matched ${matched}).`)
  .case(...maleNames)
  .case(/li$/)
    .then((name, matched) =>
      `User ${name} was determined to be male (name matched ${matched}).`)
  .default((name) => `User ${name} is of unknown gender.`)

console.log(genderResolution)

//------------------------------------------------------------

// Sometimes you know that a value can only match a finite number of cases,
// and you want to be explicit about what expressions are matched. In that case,
// you can omit the .default clause by executing the function returned by .then.
// Careful though, as if the value doesn't match anthing, the resolved value
// will be `undefined` which can cause silent errors. To be safe, it can be a
// good idea to include a .default clause which throws a TypeError.
const nextTurn = match(51)
  .case(12, 21)
    .then(() => ({ page: 8 }))
  .case(51, 710)
    .then(() => ({ causeOfDeath: 'caught and used for experiments' }))
  .case(999)
    .then(() => ({ page: 42 }))()

console.log(nextTurn.page ?
 `Go to page ${nextTurn.page}.` :
  `You are ${nextTurn.causeOfDeath}.`)

//------------------------------------------------------------

// Since you can override the comparison function, cases don't need to be
// "values". Here we define a new version of match that checks a value against
// a series of predicates.
const execMatch = a => match(a, (val, fn) => fn(val))

const pos = { x: -2, y: 5, z: 6 }

const result = execMatch(pos)
  .case(({ x }) => x * 2)
    // The third argument to .then is the result of the comparison function's
    // application with the matched value, which allows us to reuse its result.
    .then((obj, _, res) => res)
  .case(({ y, z }) => y % 2 + z)
    .then((obj, _, res) => res)
  .case(({ x, y, z }) => x + y + z)
    .then(() => 0)
  .default((obj) => { throw new TypeError(`Malformed position: ${obj}`) })

console.log(result)
