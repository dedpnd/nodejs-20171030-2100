const passport = require('koa-passport');

require('./serialize');
require('./localStrategy');
require('./JWTStrategy');
require('./facebookStrategy');
require('./githubStrategy');

module.exports = passport;
