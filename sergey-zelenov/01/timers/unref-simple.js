// kill me in 10 seconds

const timer = setTimeout(function() {
  console.log("done");
}, 5000);

console.log('hello');

setTimeout(() => console.log('timer'), 6000);

// при добавлении этой строки выход будет тут же
timer.unref();
