const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret:   'mysecret',
  jwtSecret: 'jwtSecret',
  server: {
    siteHost: 'http://localhost:3000'
  },
  mongoose: {
    uri:     'mongodb://localhost/app',
    options: {
      useMongoClient: true,
      poolSize: 5
    }
  },
  providers: {
    facebook: {
      appId: '',
      appSecret: '',
      test: {
        login: 'course.test.facebook@gmail.com',
        password: 'course-test-facebook'
      },
      passportOptions: {
        display: 'popup',
        scope:   ['email']
      }
    },
    github: {
      appId: '',
      appSecret: '',
      passportOptions: {
        display: 'popup',
        scope:   ['email']
      }
    }
  },
  mailer: {
    transport: 'gmail',
    gmail: {
      user: '',
      password: ''
    },
    senders:  {
      default:  {
        fromEmail: 'yaitsky.app@gmail.com',
        fromName:  'Igor Yaitsky',
        signature: "<em>С уважением,<br>Igor Yaitsky</em>"
      }
    }
  },
  crypto: {
    hash: {
      length:     128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
  root:     process.cwd()
};
