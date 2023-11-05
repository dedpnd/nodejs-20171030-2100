// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
console.log("here")
const bodyParser = require('koa-bodyparser');

// ctx.request.body = {name: '', surname: '', ...}
exports.init = app => app.use(bodyParser({
    jsonLimit: '512b'
}));