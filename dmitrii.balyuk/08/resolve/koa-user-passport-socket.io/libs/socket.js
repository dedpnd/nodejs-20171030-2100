let Cookies = require('cookies');
const path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
let config = require('config');
let co = require('co');
let User = require('../modules/mongo/users');

let socketIO = require('socket.io');
let socketRedis = require('socket.io-redis');
let sessionStore = require('../handlers/11-mongooseSession');

function socket(server) {
    let io = socketIO(server);

    io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

    io.use(function(socket, next) {
        let handshakeData = socket.request;
        let cookies = new Cookies(handshakeData, {}, config.keys);

        let sid = 'koa:sess:' + cookies.get('ksm');
        co(function*() {

            let session = yield* sessionStore.get(sid, true);

            if (!session) {
                throw new Error("No session");
            }

            if (!session.passport && !session.passport.user) {
                throw new Error("Anonymous session not allowed");
            }

            // if needed: check if the user is allowed to join
            socket.user = yield User.findById(session.passport.user);

            // if needed later: refresh socket.session on events
            socket.session = session;

            // on restarts may be junk sockedIds
            // no problem in them
            session.socketIds = session.socketIds ?
                session.socketIds.concat(socket.id) : [socket.id];

            yield sessionStore.save(sid, session);

            socket.on('disconnect', function() {
                co(function* clearSocketId() {
                    let session = yield* sessionStore.get(sid, true);
                    if (session) {
                        session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
                        yield* sessionStore.save(sid, session);
                    }
                }).catch(function(err) {
                    console.error("session clear error", err);
                });
            });

        }).then(function() {
            next();
        }).catch(function(err) {
            console.error(err);
            next(new Error("Error has occured."));
        });

    });

    io.on('connection', function(socket) {
        socket.broadcast.emit('message', `${socket.user.displayName} connected.`);
        // socket.emit('message', 'hello', function(response) {
        //     console.log("delivered", response);
        // });

        socket.on('message', (message) => {
            io.emit('message', `${socket.user.displayName}: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
            io.emit('message', `${socket.user.displayName} disconnect.`)
        });

        // socket.on('typing', (status) => {
        //     if (status) {
        //         socket.broadcast.emit('message', `${socket.user.displayName} typing.`);
        //     } else {
        //         // ...
        //     }
        // });
    });

}

let socketEmitter = require('socket.io-emitter');
let redisClient = require('redis').createClient( /*{localhost, 6379}*/ );
socket.emitter = socketEmitter(redisClient);

module.exports = socket;