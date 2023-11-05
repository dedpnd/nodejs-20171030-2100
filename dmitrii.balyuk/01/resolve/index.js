/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная.

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files, {done}

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК {done}
   - если файл уже есть, то выдаёт ошибку 409 {done}
   - при превышении файлом размера 1MB выдаёт ошибку 413 {done}

   DELETE /file
   - удаляет файл {done}
   - выводит 200 OK {done}
   - если файла нет, то ошибка 404 {done}

 Вместо file может быть любое имя файла.
 Так как поддиректорий нет, то при наличии / или .. в пути сервер должен выдавать ошибку 400. {GET: done}

- Сервер должен корректно обрабатывать ошибки "файл не найден" и другие (ошибка чтения файла) {GET: done}
- index.html или curl для тестирования {done}

 */

var url = require('url');
var fs = require('fs');
var http = require('http');
var path = require('path');

/**FOR MOCHA TEST */
module.exports = http.createServer(function(req, res) {

    let pathname = decodeURI(url.parse(req.url).pathname);
    let fileBase = path.parse(pathname);

    console.log(`${req.method}: ${pathname}`);
    if (fileBase.dir != '/' || fileBase.base.includes('..') || fileBase.base == '') {
        res.statusCode = 400;
        res.end("Bad path");
        return
    }

    switch (req.method) {
        case 'GET':
            let streamRead = fs.createReadStream(path.join(__dirname, 'files', fileBase.base));

            res.on("close", () => {
                streamRead.close();
            })

            streamRead.on('error', (error) => {
                if (error.code == 'ENOENT') {
                    res.statusCode = 404;
                    res.end("Not found");
                } else {
                    console.log(err);
                    res.statusCode = 500;
                    res.end('Server error');
                }
                return
            })

            // Зачем это ? 
            // .on('open', () => {
            //     res.setHeader('Content-Type', mime.lookup(filepath));
            // });

            streamRead.pipe(res);
            break
        case 'POST':
            if (req.headers['content-length'] > 1024 * 1024) {
                res.statusCode = 413;
                res.end("File very big");
                return
            }

            if (!req.headers['content-length']) {
                let fileSize = 0;
                req.on("data", (chunk) => {
                    fileSize += chunk.length
                    if (fileSize > 1024 * 1024) {
                        res.statusCode = 413;
                        res.setHeader('Connection', 'close');
                        res.end("File very big");
                        return
                    }
                })
            }

            let streamWrite = fs.createWriteStream(path.join(__dirname, 'files', fileBase.base), { flags: 'wx' });

            req.on("close", () => {
                streamWrite.destroy();
                fs.unlink(path.join(__dirname, 'files', fileBase.base), (err) => {
                    res.statusCode = 500;
                    res.end("Server error")
                });
            })

            streamWrite
                .on("close", () => {
                    res.end("OK")
                })
                .on("error", (error) => {
                    if (error.code == "EEXIST") {
                        res.statusCode = 409;
                        res.end("File exist");
                    } else {
                        console.log(error)
                        res.statusCode = 500;
                        res.end("Server error");
                    }
                    fs.unlink(path.join(__dirname, 'files', fileBase.base), (err) => {
                        res.statusCode = 500;
                        res.end("Server error")
                    });
                    return
                })

            req.pipe(streamWrite);
            break
        case 'DELETE':
            if (!fs.existsSync(path.join(__dirname, 'files', fileBase.base))) {
                res.statusCode = 404
                res.end("File not exist");
                return
            }

            fs.unlink(path.join(__dirname, 'files', fileBase.base), (err) => {
                res.statusCode = 500;
                res.end("Server error")
            });
            res.statusCode = 200
            res.end("Ok")

            break
        default:
            res.statusCode = 502;
            res.end("Not implemented");
    }

}).listen(3000);

console.log("server start localhost:3000")