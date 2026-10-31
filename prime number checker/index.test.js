const assert = require('assert');

const { isPrime } = require("./index");

assert.strictEqual(isPrime(182521213001n), true);
assert.strictEqual(isPrime(547887001n), false); // = 21401 * 25601
