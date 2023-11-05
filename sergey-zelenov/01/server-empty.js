const {Server} = require('http');

// same as http.createServer((req, res) => ...)
const server = new Server();

server.on('request', (req, res) => {
  // empty
});

// server.emit('request', req, res);

server.listen(8000);
