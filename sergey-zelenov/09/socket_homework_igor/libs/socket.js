const Cookies = require('cookies');
const config = require('config');
const mongoose = require('mongoose');
const co = require('co');
const User = require('../models/user');

const socketioJwt = require('socketio-jwt');
const socketIO = require('socket.io');
const socketRedis = require('socket.io-redis');
const sessionStore = require('./sessionStore');

function socket(server) {
  let io = socketIO(server);

  console.log('socket run!!!');

  io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

  io.on('connection', socketioJwt.authorize({
    secret: config.jwtSecret,
    timeout: 15000
  })).on('authenticated', (socket) => {
    io.emit('message', {
      message: `${socket.decoded_token.displayName} connected.`,
      type: 'system'
    });

    socket.on('message', (message) => {
      io.emit('message', message);
    });

    socket.on('disconnect', () => {
      // if (socket.session.socketIds.length === 0)
      io.emit('message', {
        message: `${socket.decoded_token.displayName} disconnected.`,
        type: 'system'
      });
    });
  })
  .on('unauthorized', function(msg) {
    console.log("unauthorized: " + JSON.stringify(msg.data));
    throw new Error(msg.data.type);
  });
}


let socketEmitter = require('socket.io-emitter');
let redisClient = require('redis').createClient(/*{localhost, 6379}*/);
socket.emitter = socketEmitter(redisClient);

module.exports = socket;
