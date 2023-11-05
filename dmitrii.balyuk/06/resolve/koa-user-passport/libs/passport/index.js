const passport = require('koa-passport');
const User = require('../../modules/mongo/users');

require('./serialize');

require('./localStrategy');

module.exports = passport;