'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('config');

const server = http.createServer((req, res) => {
  const pathname = decodeURI(url.parse(req.url).pathname);

  switch(req.method) {
  case 'GET':
    if (pathname.indexOf('/', 1) !== -1 || pathname.indexOf('..', 1) !== -1) {
      res.statusCode = 400;
      res.end('Bad request');
    }
    if (pathname === '/') {
      sendFile('public', 'index.html', res);
    } else {
      sendFile('files', pathname, res);
    }

    break;

  case 'POST':
    if (req.headers['content-length'] > 10e5) {
      res.statusCode = 413;
      res.end('Too big file');
      return;
    }

    const stream = fs.createWriteStream(`files/${pathname}`, {flags: 'wx'});

    stream.on('error', (error) => {
      if (error.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File is already exist');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    });

    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;

      if (size > config.get('limitFileSize')) {
        res.statusCode = 413;
        res.setHeader('Connection', 'close');
        res.end('File is too big!');

        stream.destroy();
        fs.unlink(`${config.get('filesRoot')}${pathname}`, (error) => {
          if (error) console.error(error);
        });
      }
    });

    stream.on('close', () => {
      res.end('ok');
    });

    req.on('close', () => {
      stream.destroy();
      fs.unlink(`${config.get('filesRoot')}${pathname}`);
    });

    req.pipe(stream);

    break;

  case 'DELETE':

    fs.unlink(path.join(__dirname, './files', pathname), (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not Found');
        } else {
          res.statusCode = 500;
          res.end('Server error');
        }
      } else {
        res.statusCode = 200;
        res.end('Ok');
      }
    });

    break;

  default:
    res.statusCode = 502;
    res.end('Not implemented');
  }

  /**
   * Sends file to client.
   * @param {string} dir Absolute path to home dir.
   * @param {string} query Requested file.
   * @param {object} res Standard response stream.
   * @return {undefined} Return nothing.
   */
  function sendFile(dir, query, res) {
    const stream = fs.createReadStream(
      path.resolve(__dirname, `${dir}/${query}`), {flags: 'r'}
      );

      stream.on('error', (error) => {
          if (error.code === 'ENOENT') {
              res.statusCode = 404;
              res.end('Not found');
          } else {
              res.statusCode = 500;
              res.end('Server error');
          }
      });

      res.statusCode = 200;

      res.on('close', () => {
          stream.destroy();
      });

      stream.pipe(res);
  }
});

server.listen(3000);

module.exports = server;
