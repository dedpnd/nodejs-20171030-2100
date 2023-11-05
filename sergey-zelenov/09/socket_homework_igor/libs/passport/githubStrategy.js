const passport = require('koa-passport');
const User = require('../../models/user');
const GithubStrategy = require('passport-github2').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const config = require('config');
const request = require('request-promise');

function UserAuthError(message) {
  this.message = message;
}

passport.use(new GithubStrategy({
  clientID: config.providers.github.appId,
  clientSecret: config.providers.github.appSecret,
  callbackURL: config.server.siteHost + '/oauth/github',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);

    let permissionError = null;

    if (!profile.emails || !profile.emails[0]) {
      permissionError = "При входе разрешите доступ к email. Он используется для идентификации пользователя.";
    }
    
    if (permissionError) {
      throw new UserAuthError(permissionError);
    }

    authenticateByProfile(req, profile, done);
  } catch (error) {
    console.log(error);
    if (error instanceof UserAuthError) {
      done(null, false, {message: error.message});
    } else {
      done(error);
    }
  }
}));