const server = require('../index');
const request = require('request');
const config = require('config');
const fs = require('fs');
const assert = require('assert');

describe('Server tests', () => {
  let app;
  before((done) => {
    app = server.listen(3000, () => {
      done();
    });
  });

  after((done) => {
    app.close(() => {
      done();
    });
  });

  beforeEach(() => {
    // cleanFilesDirectory
    // const files = fs.readDirSync('test/fixtures');

    // files.forEach(f => {
    //   fs.copyFileSync(f, d);
    // })
  });

  afterEach(() => {
    // clean Files Directory
  });

  context('GET tests', () => {
    it('should return index.html', (done) => {
      request('http://localhost:3000', (error, response, body) => {
        if (error) return done(error);

        const content = fs.readFileSync(
          config.get('publicRoot') + '/index.html', {
            encoding: 'utf-8',
          });

        assert.equal(content, body);
        done();
      });
    });

    it('should return requested file', (done) => {
      request('http://localhost:3000/example.html', (error, response, body) => {
        if (error) return done(error);

        const content = fs.readFileSync(
          config.get('filesRoot') + '/example.html', {
            encoding: 'utf-8',
          });

        assert.equal(content, body);
        done();
      });
    });
    it('should throw 400', (done) => {
      request('http://localhost:3000/whatelse/../what.html', (error, response) => {
        if (error) return done(error);
        assert.equal(response.statusCode, 400);
        done();
      });
    });
  });
  context('POST tests', () => {
    it('should send file to server', (done) => {
      // 1. stream
      // 2. options.body:
      //  2a. file
      //  2b. fileStream

      // 2a
      /*
        request.post(..., {body: fs.createReadStream()}, (err, response, body) => {
        });
      */

      // 2b
      /*
        const content = fs.readFileSync(..)
        request.post(..., {body: content}, (err, response, body) => {
        });
      */

      const req = request.post('http://localhost:3000/file.html', (error, response) => {
        if (error) return done(error);
        assert.equal(response.statusCode, 200);
        assert.equal(fs.existsSync('./files/file.html'), true);
        done();
      });
      const stream = fs.createReadStream('test/file.html');
      stream.pipe(req);
    });
    it('should throw 409 for existing file', (done) => {
      const req = request.post('http://localhost:3000/example.html', (error, response) => {
        if (error) return done(error);
        assert.equal(response.statusCode, 409);
        done();
      });
      const stream = fs.createReadStream('test/file.html');
      stream.pipe(req);
    });
    it('should throw 413 for too big file', (done) => {
      const req = request.post('http://localhost:3000/big.jpg', (error, response) => {
        if (error) {
         if (error.code === 'ECONNRESET' || error.code === 'ECANCELED') {
           return done();
         } else {
           return done(error);
         }
        }
        assert.equal(response.statusCode, 413);
        assert.equal(fs.existsSync('./files/big.jpg'), false);
        done();
      });
      const stream = fs.createReadStream('test/big.jpg');
      stream.pipe(req);
    });
  });
  context('DELETE tests', () => {
    it('should delete file', (done) => {
      request.delete('http://localhost:3000/file.html', (err, res, body) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.equal(fs.existsSync('./files/file.html'), false);
        done();
      });
    });
    it('should throw 404', (done) => {
      request.delete('http://localhost:3000/doesntexist', (err, response, body) => {
        if (err) return done(err);
        assert.equal(response.statusCode, 404);
        done();
      });
    });
  });
});
