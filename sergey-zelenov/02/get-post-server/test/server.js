const server = require('../server');
const request = require('request');
const config = require('config');
const fs = require('fs');
const assert = require('assert');

describe('server tests', () => {
  let app;
  before((done) => {
    app = server.listen(3333, () => {
      done();
    });
  });

  after((done) => {
    app.close(() => {
      done();
    });
  });

  describe('GET request', () => {

    it('should return index.html', (done) => {
      /*
        1. launch server
        2. perform request GET /
        3. read index.html from disk
        4. compare contents
        5. terminate server
      */

      request('http://localhost:3333', function (error, response, body) {
        if (error) return done(error);

        const content = fs.readFileSync(config.get('publicRoot') + '/index.html', {
          encoding: 'utf-8'
        });

        assert.equal(content, body);

        done();
      });
    });

    it('will run only after previous', () => {
      assert.equal(1, 1);
    });

  });

});
