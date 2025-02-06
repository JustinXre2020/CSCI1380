const util = require('../util/util.js');
const { performance } = require('perf_hooks');

const itetation = 1000;

// 1. test strings
const start_str = performance.now();
for (let i = 0; i < itetation; i++) {
    const input = "Hello, World!";
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
}
const end_str = performance.now();

// 2. test Functions
const start_func = performance.now();
for (let i = 0; i < itetation; i++) {
    const input = { key: (a, b) => a + b };
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
}
const end_func = performance.now();

// 3. test nested Obj
const start_obj = performance.now();
for (let i = 0; i < itetation; i++) {
    const input = [1, 2, 3, 4, 5, [6, 7, 8, 9, 10], {a: 1, b: 2, c: 3}];
    const serialized = util.serialize(input);
    const deserialized = util.deserialize(serialized);
}
const end_obj = performance.now();

console.log(`1000 String execution time: ${(end_str - start_str).toFixed(3) / itetation}ms`);
console.log(`1000 Function execution time: ${(end_func - start_func).toFixed(3) / itetation}ms`);
console.log(`1000 Nested Object execution time: ${(end_obj - start_obj).toFixed(3) / itetation}ms`);
