'use strict';

console.log();
console.log(undefined);
console.log(null);
console.log([]);

console.log('blah'); // blah
console.log(2 < 3); // true
console.log(2 > 3); // false

console.log(1,2,3); // 1 2 3
console.log([1,2,3]); // [1,2,3]

const obj = {a:1};
console.log(obj); // Object {a=1}
console.log(JSON.stringify(obj)); // {"a":1}

// anything with multiple args are split with single spaces, no added quotes
console.log('put', 'a', 'donk', 'on', 'it'); // put a donk on it
console.log('a', 2, 3.5); // a 2 3.5

// path checks
console.log(fb.ComponentPath);
console.log(fb.FoobarPath);
console.log(fb.ProfilePath);
