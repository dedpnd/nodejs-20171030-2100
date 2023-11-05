// Проблема отсутствующего catch и проглоченной ошибки

const fs = require('mz/fs');

async function read(path) {
  const stat = await fs.stat(path);

  if (stat.isDirectory()) {
    const files = await fs.readdir(path);
    return files;
  } else {
    const content = await fs.readFile(path);
    return content;
  }
}

/*
  function read(path) {
    return fs.stat(path)
      .then(stat => {
        if (stat.isDirectory()) return fs.readdir(path);
        else return fs.readFile(path);
      });
  }
*/

read(__dirname).then(console.log).catch(console.error);
