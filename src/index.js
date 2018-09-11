// @flow
import { type Context } from 'koa'
import en from 'nanoid-good/locale/en'
import generateNanoId from 'nanoid-good/generate'

const nanoid = generateNanoId(en)

export default function requestId(options?: Object) {
  const defaults = {
    prefix: '',
    sufix: '',
    length: 21,
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...options,
  }

  return async function requestIdMiddleware(
    ctx: Context,
    next: () => Promise<*>,
  ) {
    const {
      prefix,
      sufix,
      length,
      alphabet,
      generate,
      header = 'X-Request-Id',
    } = defaults

    const isCustom = generate && typeof generate === 'function'
    const generatedId = isCustom
      ? generate()
      : nanoid(alphabet, parseInt(length, 10))

    if (generatedId) {
      const id = `${prefix}${generatedId}${sufix}`

      ctx.request.id = id
      ctx.set(header, id)
    }

    return next()
  }
}
