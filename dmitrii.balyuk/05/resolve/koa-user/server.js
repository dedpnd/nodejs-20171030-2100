const path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');

const config = require('config');
const server = require('./index');

server.listen(config.get('port'), () => {
    console.log("Server strated port: " + config.get('port'));
})