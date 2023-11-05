// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?
const http = require('http');
const fs = require('fs');

let clients = [];

http.createServer((req, res) => {

  switch (req.method + ' ' + req.url) {
  case 'GET /':
    // 1. нет обработки ошибок
    // 2. нет обработки обрыва соединения
    // путь до файла
    // content-type
    fs.createReadStream('index.html').pipe(res);
    break;

  case 'GET /subscribe':
    console.log("subscribe");
    // 3. нет обработки обрыва соединения
    clients.push(res);
    break;

  case 'POST /publish':
    // 7. кодировка
    // req.setEncoding('utf-8')
    // body = []; Buffer.toString('utf-8')
    let body = '';

    req
      .on('data', data => {
        // 4. слишком большой размер body
        body += data;
      })
      .on('end', () => {
        // 5. некорректный json
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        clients.forEach(res => {
          // 6. toString() && exists
          res.end(body.message);
        });

        clients = [];

        res.end("ok");
      });

      // обрыв соединения

    break;

  default:
    res.statusCode = 404;
    res.end("Not found");
  }


}).listen(3000);
