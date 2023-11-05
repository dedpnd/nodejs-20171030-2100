const fs = require('fs');

// fs.readFile(f, cb)

function readFile(filePath) {
  /* ваш код */
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding: 'utf-8'}, (err, content) => {
      if (err) return reject(err);

      resolve(content);
    });
  });
}

readFile(__filename).then(
  console.log,
  console.error
);
