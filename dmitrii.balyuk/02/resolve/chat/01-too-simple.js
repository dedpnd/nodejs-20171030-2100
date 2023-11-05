// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?
const http = require('http');
const fs = require('fs');

let clients = [];

http.createServer((req, res) => {

    switch (req.method + ' ' + req.url) {
        case 'GET /':
            /**Нет обработки ошибок 
             * При закрытие соеденения поток не закрывается 
             */
            fs.createReadStream('index.html').pipe(res);
            break;

        case 'GET /subscribe':
            console.log("subscribe");
            clients.push(res);
            break;

        case 'POST /publish':
            /**Наверное тут лучше использовать потоки :) */
            let body = '';
            /**
             * Нет проверки на размер и тип
             */
            req
                .on('data', data => {
                    body += data; // лишняя оперция
                })
                .on('end', () => {
                    body = JSON.parse(body);

                    console.log("publish '%s'", body.message);

                    clients.forEach(res => {
                        res.end(body.message);
                    });

                    clients = [];

                    res.end("ok");
                });

            break;

        default:
            res.statusCode = 404;
            res.end("Not found");
    }


}).listen(3000);