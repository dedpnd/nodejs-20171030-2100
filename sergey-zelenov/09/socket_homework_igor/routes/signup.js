const passport = require('../libs/passport');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('config');
const crypto = require('crypto');
const sendMail = require('../libs/sendMail');

exports.post = async function(ctx, next) {
  const user = await User.create({ ...ctx.request.body });
  const token = crypto.randomBytes(64).toString('hex');

  user.token = token;
  user.verified = false;
  await user.save();

  let letter = await sendMail({
    template:     'verify-mail',
    subject:      'Подтверждение email',
    to:           ctx.request.body.email,
    name:         ctx.request.body.displayName,
    url:        `${config.server.siteHost}/verify/${token}`
  });

  ctx.body = JSON.stringify({ statusText: 'OK' });
};