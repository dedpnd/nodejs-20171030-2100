const app = require('./server');
const socket = require('./libs/socket');

const server = app.listen(3000);
socket(server);
