  // secret data can be moved to env variables
  // or a separate config

  module.exports = {
      port: 3000,
      secret: 'mysecret',
      root: process.cwd()
  };