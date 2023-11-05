const passport = require('koa-passport');
const compose = require('koa-compose');

exports.get = compose([
  passport.authenticate('jwt'),
  async (ctx, next) => {
    if (!ctx.state.user) {
      ctx.status = 400;
      ctx.body = {error: 'invalid credentials'};
      return;
    }

    ctx.body = {
      private: 'top most secret info',
      email: ctx.state.user.email
    };
  }
]);
