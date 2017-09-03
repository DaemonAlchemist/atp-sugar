/**
 * Created by Andrea on 9/3/2017.
 */

import assert from 'assert';
import {o} from 'atp-sugar';

describe('ATP-Sugar', () => {
    describe('Object', () => {
        describe('#as', () => {
            it('should work for numbers', () => {
                o(42).as(num => {
                    assert.equal(num, 42);
                });
            });

            it('should work for strings', () => {
                o("test").as(str => {
                    assert.equal(str, "test");
                });
            });

            it('should work for objects', () => {
                o({test: "foo"}).as(obj => {
                    assert.deepEqual(obj, {test: "foo"});
                });
            });

            it('should work for functions', () => {
                o(() => 42).as(f => {
                    assert.equal(f(), 42);
                });
            });

            it('should work for arrays', () => {
               o([1, 2, 3]).as(arr => {
                   assert.deepEqual(arr, [1, 2, 3]);
               });
            });

            it('should return the value of the callback', () => {
                assert.equal(o(42).as(num => 10 + num), 52);
            });
        });
        describe("#filter", () => {
            it('should return only matching elements', () => {
                assert.deepEqual(
                    o({foo: 1, bar: 2}).filter(obj => obj ===1).raw,
                    {foo: 1}
                );
            });
            it('should filter on keys', () => {
                assert.deepEqual(
                    o({foo: 1, bar: 2}).filter((obj, key) => key === 'bar').raw,
                    {bar: 2}
                );
            });
        });
        describe("#keys", () => {
            it('should return the keys of an object', () => {
                assert.deepEqual(
                    o({foo: 1, bar: 2}).keys(),
                    ['foo', 'bar']
                );
            });
        });
        describe("#map", () => {
            it('should keep key associations', () => {
               assert.deepEqual(
                   o({foo: 1, bar: 2}).map(num => num * 2).raw,
                   {foo: 2, bar: 4}
               );
            });
            it('should be able to use keys in mapper', () => {
                assert.deepEqual(
                    o({foo: 1, bar: 2}).map((num, key) => key + ":" + num).raw,
                    {foo: "foo:1", bar: "bar:2"}
                );
            });
        });

    });
});
