const server = require('./index');

server.listen(3000).then(() => {
    console.log("server start localhost:3000")
}).catch((err) => {
    console.log(err);
})