const fs = require('fs');

const stream = fs.createReadStream(__filename);

// stream.on, stream.emit

// readable, writable, transform, duplex
// Stream1, Stream2, Stream3

// __data: [] 64kb

// paused

// stream.on('readable', () => {
//   const chunk = stream.read();
// });

// .pipe() / .on('data')

// flowing

// stream.pipe(streamOut)
// stream.on('data', chunk => {...})
// .resume() / .pause()

// 'end', 'finish', 'close'
