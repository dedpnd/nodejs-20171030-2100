
Error.stackTraceLimit = 10000;
require('clarify');
require('trace');

function f(ms) {
  setTimeout(() => {
    throw new Error("BAH!");
  }, ms);
}

function g() {
  f(100);
}

g();
