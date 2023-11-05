// В какой момент срабатывают - до или после чтения файла?
const fs = require('fs');

/*
  macroqueue=[open, immediate]
  microqueue=[nextTick1, nextTick2, promise]

  start
  nextTick
  promise
  open
  immediate
*/

fs.readFile(__filename, (err, fd) => {
  console.log('IO!');
});

setImmediate(() => {
  console.log('immediate');
});

new Promise(resolve => {
  resolve('promise');

  // fs.open()
}).then(console.log);

process.nextTick(() => {

  console.log('nextTick1');
});

process.nextTick(() => {
    console.log('nextTick2');
});

console.log('start!');

for (let i = 0; i < 10000000000; i++) {}
