if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

app.keys = [config.secret];

const path = require('path');
const fs = require('fs');
const passport = require('./libs/passport');
const jwt = require('jwt-simple');

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// can be split into files too
const Router = require('koa-router');
const router = new Router();

router.post('/login', require('./routes/login').post);
router.post('/signup', require('./routes/signup').post);
router.get('/verify/:token', require('./routes/verify-mail').get);

router.get('/test', require('./routes/test').get);

['facebook', 'github'].forEach(provider => {
  router.get(`/login/${provider}`, passport.authenticate(provider, config.providers[provider].passportOptions));
  router.get(`/connect/${provider}`, passport.authorize(provider, config.providers[provider].passportOptions));
  router.get(`/oauth/${provider}`, passport.authenticate(provider, { session: false }), async (ctx, next) => {
    const payload = {
      id: ctx.state.user._id,
      displayName: ctx.state.user.displayName
    };
    const token = jwt.encode(payload, config.jwtSecret);

    ctx.body = ctx.render('authenticated', {
      displayName: ctx.state.user.displayName,
      email: ctx.state.user.email,
      token
    });
  });
});
// 
// router.get('/private', passport.authenticate('jwt'), async (ctx, next) => {
//   if (ctx.isAuthenticated()) {...}
// });

app.use(router.routes());

module.exports = app;
