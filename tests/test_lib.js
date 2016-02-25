var assert = require('assert'),
    lib = require('../core/lib.js');

describe('lib', function () {
    describe('#unset', function () {
        it('should unset prop without mutating original object', function () {
            var obj = { a: 1, b: 2, c: 3 };
            assert.deepEqual({ a: 1, c: 3 }, lib.unset(obj, 'b'));
            assert.deepEqual({ a: 1, b: 2, c: 3 }, obj);
        });
    });
});

