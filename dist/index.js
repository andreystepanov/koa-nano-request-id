"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = requestId;

var _debug = _interopRequireDefault(require("debug"));

var _en = _interopRequireDefault(require("nanoid-good/locale/en"));

var _generate = _interopRequireDefault(require("nanoid-good/generate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nanoid = (0, _generate.default)(_en.default);
const logger = (0, _debug.default)('koa:nano-request-id');

function requestId(options) {
  const defaults = {
    key: 'X-Request-Id',
    prefix: '',
    sufix: '',
    length: 21,
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...options
  };
  return async function requestIdMiddleware(ctx, next) {
    const {
      prefix,
      sufix,
      length,
      alphabet,
      generate,
      key
    } = defaults;
    const isCustom = generate && typeof generate === 'function';
    const generatedId = isCustom ? generate() : nanoid(alphabet, parseInt(length, 10));

    if (generatedId) {
      const id = `${prefix}${generatedId}${sufix}`;
      ctx.request.id = id;
      ctx.set(key, id);
      logger('%s: %s', key, id);
    }

    return next();
  };
}
