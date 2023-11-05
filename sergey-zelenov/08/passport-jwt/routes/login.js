const config = require('config');
const jwt = require('jwt-simple');
const passport = require('koa-passport');
const compose = require('koa-compose');

exports.post = compose([
  passport.authenticate('local'),
  async (ctx, next) => {
    if (ctx.state.user) {
      const payload = {
        id: ctx.state.user._id,
        displayName: ctx.state.user.displayName
      };

      const token = jwt.encode(payload, config.jwtSecret);

      ctx.body = {token};
    } else {
      ctx.status = 400;
      ctx.body = {error: "Invalid credentials"};
    }
  }
]);
