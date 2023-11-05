// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?
const http = require('http');
const fs = require('fs');

let clients = [];

http.createServer((req, res) => {
  switch (req.method + ' ' + req.url) {
    case 'GET /':
    // 1. Проверка stream на ошибки
    // 2. Проверка закрытия соединения (destroy стрима, если клиент ушел)
    fs.createReadStream('index.html').pipe(res);
    break;

  case 'GET /subscribe':
    console.log('subscribe');
    clients.push(res);
    break;

  case 'POST /publish':
    let body = '';

    req
      .on('data', (data) => {
        body += data;
        // 3. Проверка на слишком большие данные от клиента
      })
      .on('end', () => {
        // 4. Проверка на невалидный JSON
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        // 5. Проверка res.on('close') и последующий splice этого res
        clients.forEach((res) => {
          res.end(body.message);
        });

        clients = [];
        // А зачем тут еще один res.end ?
        res.end('ok');
      });

    break;

  default:
    res.statusCode = 404;
    res.end('Not found');
  }


}).listen(3000);
