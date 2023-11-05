const passport = require('koa-passport');
const config = require('config');
const {Strategy, ExtractJwt} = require('passport-jwt');
const User = require('../../models/user');

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.get('jwtSecret'),
  session: false
}, function(jwtPayload, done) {
  console.log('----');
  console.log(jwtPayload);
  console.log('----');
  User.findById(jwtPayload.id, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
}));
