const {Server} = require('http');
const requestHandler = require('request-handler'); // NODE_PATH=./modules
const dateUtils = require('dateUtils');

const server = new Server(requestHandler);

server.listen(8000);

/*
  1. core modules
  2. ./node_modules
      ../node_modules
      ../../node_modules

  3. NODE_PATH=./handlers:./utils

*/
