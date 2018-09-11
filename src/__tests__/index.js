import requestId from '../index'

const set = jest.fn()
const getContext = () => ({
  request: {},
  state: {},
  set,
})
const next = jest.fn()
const middleware = requestId()

beforeEach(() => {
  next.mockClear()
  set.mockClear()
})

test('requestId middleware is defined', () => {
  expect(requestId).toBeDefined()
  expect(typeof requestId).toBe('function')
  expect(middleware).toBeDefined()
  expect(typeof middleware).toBe('function')
})

test('sets request.id with default options', () => {
  const context = getContext()
  middleware(context, next)

  const [key, value] = set.mock.calls[0]

  expect(context.request.id).toBeDefined()
  expect(next).toBeCalledTimes(1)
  expect(set).toBeCalledTimes(1)
  expect(key).toEqual('X-Request-Id')
  expect(value).toEqual(context.request.id)
})

test('adds prefix and sufix to id', () => {
  const context = getContext()
  const middlewareWithOptions = requestId({
    prefix: 'prefix-',
    sufix: '-sufix',
  })

  middlewareWithOptions(context, next)

  expect(context.request.id).toContain('prefix-')
  expect(context.request.id).toContain('-sufix')
})

test('sets length limit to id', () => {
  const context = getContext()
  const length = 10
  const middlewareWithOptions = requestId({
    length,
  })

  middlewareWithOptions(context, next)

  expect(context.request.id).toHaveLength(length)
})

test('sets custom header key', () => {
  const context = getContext()
  const key = 'X-Custom-Header'
  const middlewareWithOptions = requestId({
    key,
  })

  middlewareWithOptions(context, next)

  expect(set.mock.calls[0][0]).toEqual(key)
})

test('sets custom alphabet', () => {
  const context = getContext()
  const alphabet = '99999'
  const middlewareWithOptions = requestId({
    alphabet,
    length: 5,
  })

  middlewareWithOptions(context, next)

  expect(context.request.id).toEqual(alphabet)
})

test('uses custom generate function', () => {
  const context = getContext()
  const generatedid = 'generated-id'
  const generate = jest.fn(() => generatedid)
  const middlewareWithOptions = requestId({ generate })

  middlewareWithOptions(context, next)

  expect(context.request.id).toEqual(generatedid)
  expect(generate).toBeCalledTimes(1)
})

test("doesn't sets id and header if generated id is empty or undefined", () => {
  const context = getContext()
  const generate = jest.fn()
  const middlewareWithOptions = requestId({ generate })

  middlewareWithOptions(context, next)

  expect(context.request.id).not.toBeDefined()
  expect(generate).toBeCalledTimes(1)
})
