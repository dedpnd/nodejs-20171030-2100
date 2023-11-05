const User = require('./models/user');
const mongoose = require('mongoose');

const config = require('config');
mongoose.connect(config.mongoose.uri, config.mongoose.options);


mongoose.Promise = Promise;

async function createUsers() {
  const users = [
    {
      displayName: 'myUser1',
      email: 'myUser1@user.com',
      password: '123123'
    },
    {
      displayName: 'myUser2',
      email: 'myUser2@user.com',
      password: '123123'
    }
  ];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await User.create(user);
  }

  return 'All done!';
}

createUsers()
  .then(console.log)
  .catch(console.error)
  .then(() => mongoose.disconnect());
