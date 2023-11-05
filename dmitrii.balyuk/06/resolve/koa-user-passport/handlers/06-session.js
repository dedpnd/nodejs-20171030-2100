// in-memory store by default (use the right module instead)
const session = require('koa-generic-session');
const mongooseStore = require('koa-session-mongoose');
const convert = require('koa-convert');
// ctx.session = {lala: 'lala'}
exports.init = app => app.use(convert(session({
    key: 'ksm',
    cookie: {
        httpOnly: true,
        path: '/',
        overwrite: true,
        signed: false, // by default true (not needed here)
        maxAge: 3600 * 4 * 1e3 // session expires in 4 hours, remember me lives longer    
    },
    rolling: true,

    store: mongooseStore.create({
        model: 'Session',
        expires: 3600 * 4
    })
})));