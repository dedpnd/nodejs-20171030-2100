const passport = require('../libs/passport');

exports.get = async function(ctx, next) {
  await passport.authenticate('jwt', (err, user) => {
    if (err) throw err;

    if (user) {
      ctx.body = ctx.body = JSON.stringify({ text: 'Hello!', email: 'Awesome secret info!!!'  });
    } else {
      ctx.body = JSON.stringify({ text: 'Hello!' });
    }
  })(ctx, next);
};
