const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('config');

exports.get = async (ctx, next) => {
  const { token } = ctx.params;
  const user = await User.findOne({ token });

  if (user) {
    user.verified = true;
    await user.save();

    const payload = {
      id: user.id,
      displayName: user.displayName
    };
    const token = jwt.encode(payload, config.jwtSecret);
    ctx.body = JSON.stringify({
      displayName: user.displayName,
      email: user.email,
      token
    });
  } else {
    ctx.status = 400;
    // koa позволяет отдавать полноценные объекты, они отдаются как application/json
    ctx.body = JSON.stringify({ error: "Invalid credentials" });
  }
};
