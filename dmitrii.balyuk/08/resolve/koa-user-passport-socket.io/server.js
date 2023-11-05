const path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');

const config = require('config');
const server = require('./index');

const app = server.listen(config.get('port'), () => {
    console.log("Server strated port: " + config.get('port'));
})

const socket = require('./libs/socket');
socket(app);