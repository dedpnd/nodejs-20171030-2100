const config = require('config');
const jwt = require('jwt-simple');
const passport = require('../libs/passport');
const compose = require('koa-compose');

exports.post = compose([
  passport.authenticate('local'),
  async (ctx, next) => {
    if (ctx.state.user) {
      const payload = {
        id: ctx.state.user._id,
        displayName: ctx.state.user.displayName
      };
      console.log(ctx.state.user)
      const token = jwt.encode(payload, config.jwtSecret);

      ctx.body = JSON.stringify({ 
        email: ctx.state.user.email,
        displayName: ctx.state.user.displayName,
        token
      });
    } else {
      ctx.status = 400;
      ctx.body = JSON.stringify({ error: "Invalid credentials" });
    }
  }
]);