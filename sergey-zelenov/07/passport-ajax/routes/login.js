const passport = require('koa-passport');
const compose = require('koa-compose');

exports.post = compose([
  passport.authenticate('local'),
  async (ctx, next) => {
    if (ctx.state.user) {
      ctx.body = {
        user: ctx.state.user.getPublicFields()
      };
    } else {
      ctx.status = 401;
      ctx.body = { error: info };
    }
  }
]);
