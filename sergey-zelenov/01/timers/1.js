
console.clear && console.clear();

Promise.resolve(1)
 .then(() => console.log(1))
 .then(() => console.log(2))
 .then(() => console.log(3))
 .then(() => console.log(4))
 .then(() => console.log(5));

Promise.all([
 Promise.resolve().then(() => console.log('one')),
 Promise.resolve().then(() => console.log('one')),
 Promise.resolve().then(() => console.log('one')),
 Promise.resolve().then(() => console.log('one'))
]).then(() => console.log('all-1'))
 .then(() => console.log('all-2'));

new Promise(() => {
 console.log('body');
});



console.log('sync');
