// несколько promise параллельно
// Вопрос - если ошибка, то как сделать, чтобы остальные результаты были получены,
// а вместо ошибочного - объект ошибки?

const http = require('http');

function loadUrl(url) {
    return new Promise(function(resolve, reject) {

        http.get(url, function(res) {
                if (res.statusCode != 200) { // ignore 20x and 30x for now
                    reject(new Error(`Bad response status ${res.statusCode}.`));
                    return;
                }

                let body = '';
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    resolve(body);
                });

            }) // ENOTFOUND (no such host ) or ECONNRESET (server destroys connection)
            .on('error', reject);
    });
}

Promise.all([
    loadUrl('http://ya.ru'),
    loadUrl('http://javascript.ru'),
    loadUrl('http://learn.javascript.ru')
]).then(function(results) { // [err, html, html]
    console.log(results.map(function(html) { return html.slice ? html.slice(0, 80) : html; }));
}, (error) => {
    console.log(123)
}).catch(console.log);