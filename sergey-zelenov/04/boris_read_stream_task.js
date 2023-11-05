const fs = require("fs");

// хотим читать данные из потока в цикле

function readStream(stream) {
  // handle error!!

  return () => {
    return new Promise(function(resolve, reject) {
      //Не понял почему не кидает ошибку о макс слушателях, но рабоает
      function onData(data) {
        stream.pause();
        console.log('data:', data.length);
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        stream.removeListener('error', onError)
        resolve(data);
      }
      function onEnd() {
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        stream.removeListener('error', onError)
        resolve(null);
      }
      function onError(error) {
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        stream.removeListener('error', onError)
        reject(error);
      }
      stream
        .on('data', onData)
        .on('end', onEnd)
        .on('error', onError);

      stream.resume();

      // paused | flowing
    });
  };
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function read(path) {
  let stream = fs.createReadStream(path, {
    highWaterMark: 60,
    encoding: "utf-8"
  });

  let data;

  // ЗАДАЧА: написать такой readStream
  let reader = readStream(stream);

  while (data = await reader()) {
    console.log(data);
    console.log('==============================')
    await sleep(1000);
  }
}

read(__filename).catch(console.error);
