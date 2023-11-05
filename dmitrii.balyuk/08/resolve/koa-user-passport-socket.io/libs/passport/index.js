const passport = require('koa-passport');
const User = require('../../modules/mongo/users');

require('./serialize');
passport.use(require('./localStrategy'));
passport.use(require('./facebookStrategy'));
passport.use(require('./githubStrategy'));

module.exports = passport;