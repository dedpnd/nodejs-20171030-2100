const fs = require('fs');

const fileStream = fs.createReadStream('bad-char.txt', {highWaterMark: 9 /* читать по 9 байт для наглядности */});

/*
// Вариант 1 указать кодировку
// Нода будет сама декодировать буфер в строку,
// если она битая - запоминать лишние символы и приплюсовывать их в начало следующего пакета
fileStream.setEncoding('utf-8');

let content = '';
fileStream.on('data', data => {
  console.log(data)
  content += data;
});

fileStream.on('end', () => {
  console.log(content);
});
*/

/*
// Вариант 2
// Читать массив буферов, потом всё объединять и уже тогда приводить к строке
let dataPieces = [];

fileStream.on('data', buffer => {
  dataPieces.push(buffer);
});

fileStream.on('end', () => {
  const buffer = Buffer.concat(dataPieces);
  console.log(buffer.toString('utf-8'));
});
*/
