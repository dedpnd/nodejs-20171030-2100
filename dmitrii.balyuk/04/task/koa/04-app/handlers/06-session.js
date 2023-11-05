// in-memory store by default (use the right module instead)
const session = require('koa-generic-session');
const convert = require('koa-convert');
// ctx.session = {lala: 'lala'}
exports.init = app => app.use(convert(session({
  cookie: {
    signed: false
  }
})));
