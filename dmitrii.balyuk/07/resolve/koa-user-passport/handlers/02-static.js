// Usually served by Nginx
const path = require('path');
const serve = require('koa-static');

exports.init = app => app.use(serve(path.join(__dirname, '..\\public')));