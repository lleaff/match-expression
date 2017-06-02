const match = require('./index.js')

it(`Matches a value against a series of values`, () => {
  const matcher = val => match(val)
    .case(0).then(() => 'zero')
    .case(1).then(() => 'one')
    .case(2).then(() => 'two')
    .default(() => 'default')

  expect(matcher(1)).toBe('one')
  expect(matcher(2)).toBe('two')
  expect(matcher(0)).toBe('zero')
  expect(matcher(77)).toBe('default')
})

it(`Can be resolved without a "default" handler by calling the function returned
 by "then"`, () => {
  const matcher = val => match(val)
    .case('foo').then(() => 'FOO')
    .case('bar').then(() => 'BAR')
    .case('baz').then(() => 'BAZ')()

  expect(matcher('foo')).toBe('FOO')
  expect(matcher('bar')).toBe('BAR')
  expect(matcher('baz')).toBe('BAZ')

  expect(match(1).case(1).then(() => 'one')()).toBe('one')
})

it(`Multiple case statements can be chained`, () => {
  const matcher = val => match(val)
    .case(0)
    .case(1)
    .case(2)
      .then(() => '012')
    .case(3)
      .then(() => '3')
    .default(() => 'default')

  expect(matcher(0)).toBe('012')
  expect(matcher(1)).toBe('012')
  expect(matcher(2)).toBe('012')
  expect(matcher(3)).toBe('3')
})

it(`Matches a value against a series of [series of] values`, () => {
  const matcher = val => match(val)
    .case(0, 1, 2).then(() => 'first')
    .case(3, 4).then(() => 'second')
    .case(5).then(() => 'third')
    .default(() => 'default')

  expect(matcher(1)).toBe('first')
  expect(matcher(3)).toBe('second')
  expect(matcher(5)).toBe('third')
  expect(matcher(-1)).toBe('default')
})

it(`Matches with strict equality by default`, () => {
  const tokenA = { foo: 'bar' }
  const tokenB = {}
  const matcher = val => match(val)
    .case(tokenA).then(() => 'A')
    .case(tokenB).then(() => 'B')
    .default(() => 'DEFAULT')

  expect(matcher(tokenA)).toBe('A')
  expect(matcher(tokenB)).toBe('B')
  expect(matcher({ foo: 'bar' })).toBe('DEFAULT')
})

it(`Accepts a custom comparison function as optional second argument`, () => {
  const matcher = val => match(val, (a, b) => a == b)
    .case(0, 1, 2).then(() => 'first')
    .case(3, 4).then(() => 'second')
    .case(5).then(() => 'third')
    .default(() => 'default')

  expect(matcher('1')).toBe('first')
  expect(matcher('3')).toBe('second')
  expect(matcher(5)).toBe('third')
  expect(matcher(null)).toBe('default')
})

it(`Comparison function is run only until it has a match`, () => {
  const cmp = jest.fn((a, b) => a === b)
  const matcher = val => match(val, cmp)
    .case(0, 1, 2)
      .then(() => 'first')
    .case(3, 4)
      .then(() => 'second')
    .case(5)
      .then(() => 'third')
    .default(() => 'default')

  expect(matcher(1)).toBe('first')
  expect(cmp).toHaveBeenCalledTimes(2)
  cmp.mockClear()
  expect(matcher(3)).toBe('second')
  expect(cmp).toHaveBeenCalledTimes(4)
  cmp.mockClear()
  expect(matcher(4)).toBe('second')
  expect(cmp).toHaveBeenCalledTimes(5)
  cmp.mockClear()
  expect(matcher(5)).toBe('third')
  expect(cmp).toHaveBeenCalledTimes(6)
  cmp.mockClear()
  expect(matcher(null)).toBe('default')
  expect(cmp).toHaveBeenCalledTimes(6)
})

it(`"then" handler is passed 3 arguments: (value, match, compareFnResult)`, () => {
  const matcher = val => match(val, (a, b) => b.exec(a))
    .case(/f(.)o/, /b(.)r/)
    .case(/b(.)z/)
    .then((...args) => args)
    .case(/q(.)x/)
    .then((...args) => args)
    .default(() => 'default')

  expect(matcher('foo')).toEqual(['foo',  /f(.)o/, /f(.)o/.exec('foo')])
  expect(matcher('bar')).toEqual(['bar',  /b(.)r/, /b(.)r/.exec('bar')])
  expect(matcher('baz')).toEqual(['baz',  /b(.)z/, /b(.)z/.exec('baz')])
  expect(matcher('qux')).toEqual(['qux',  /q(.)x/, /q(.)x/.exec('qux')])
  expect(matcher('none')).toEqual('default')
})
