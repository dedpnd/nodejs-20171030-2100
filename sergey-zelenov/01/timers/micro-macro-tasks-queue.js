// какой порядок вывода в console ?

// 1
// macro = []
// micro = [then 1, then2]

// 2
// macro = [setInterval]
// micro = []

// 3
// macro = [setTimeout 1]
// micro = [then 4]

// 4
// macro = [setTimeout (then 3)]

// 5
// macro = [setInterval]
// micro = []

// 6
// macro = [setTimeout 2]
// micro = []

// macroqueues = [setInterval, setTimeout 1, then 3, immediate, setInterval, setTimeout 2];

const intervalId = setInterval(() => {
  console.log('setInterval');
}, 0);

setTimeout(() => {
  console.log('setTimeout 1');

  const promise = new Promise((resolve, reject) => {
    resolve('then 4');
  });

  promise
    .then((value) => {
      console.log(value);

      setTimeout(() => {
        console.log('setTimeout 2');
        clearInterval(intervalId);
      }, 0);
    });
}, 0);

setImmediate(() => {
  console.log('immediate');
});

const promise = new Promise((resolve, reject) => {
  resolve('then 1');
});

promise
  .then((value) => {
    console.log(value);
    return 'then 2';
  })
  .then((value) => {
    console.log(value);

    return new Promise((resolve, reject) => {
      setTimeout(resolve, 0, 'then 3');
    });
  })
  .then((value) => {
    console.log(value);
  });
