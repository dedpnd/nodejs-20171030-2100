const fs = require('mz/fs');

console.time('file sizes')
fs.readdir(__dirname)
  .then(entries => {
    return Promise.all(
      entries.map(entry => fs.stat(entry))
    );
  })
  .then(entries => entries.filter(entry => entry.isFile()))
  .then(stats => {
    return stats.map(stat => stat.size);
  })
  .then(sizes => {
    return sizes.reduce((sum, size) => sum + size);
  })
  .then(res => {
    console.timeEnd('file sizes');
    return res;
  })
  .then(console.log)
  .catch(console.error);
