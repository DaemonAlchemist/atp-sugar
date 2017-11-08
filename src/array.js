import {AtpObject, o} from './object';

/**
 * Array convenience functions
 */
export class AtpArray extends AtpObject
{
    /**
     * Returns a new array with all elements of 'other' removed from the original array
     * @param {Array} other - An array holding the elements to remove from the original array
     * @returns {Array}
     * @example a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
     *  .difference([1, 2, 3]) ==
     *  [4, 5, 6, 7, 8, 9, 10]
     */
    difference(other) {
        return other ? this.raw.filter(item => !other.includes(item)) : [];
    }

    /**
     * Returns a new array that contains only the elements that are in both the original array and the 'other' array
     * @param {Array} other
     * @returns {Array}
     * @example a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
     *  .intersect([1, 2, 3]) ==
     *  [1, 2, 3]
     */
    intersect(other) {
        return other ? this.raw.filter(item => other.includes(item)) : [];
    }

    /**
     * Sorts an array of objects by a given field.  The sort is done lexographically
     * @param {String} fieldName - the field to sort by
     * @returns {Array}
     * @example a([{name: "Joe"}, {name: "Bob"}, {name: "Ann"}])
     *  .sortBy("name") ==
     *  [{name: "Ann"}, {name: "Bob"}, {name: "Joe"}]
     */
    sortBy(fieldName) {
        return this.raw.sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
    }

    /**
     * Partitions the elements of an array into separate arrays based on a partition function.
     * @param {Function} partitionFunc - A function that will be applied to each element in the array.
     * @returns {Object}
     * @example a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
     *  .partition(n => n % 3) ==
     *  {
     *      0: [3, 6, 9],
     *      1: [1, 4, 7, 10],
     *      2: [2, 5, 8]
     *  }
     */
    partition(partitionFunc) {
        return o(this.reduce((partitioned, cur) => o(partitionFunc(cur)).as(key =>
            Object.assign({}, partitioned, {[key]: partitioned[key] ? partitioned[key].concat(cur) : [cur]})
        ), {}));
    }

    /**
     * Returns the maximum element in the array
     * @returns {Number}
     */
    max() {
        return Math.max(...this.raw);
    }
}

/**
 * Wraps an array in an ATPArray
 * @param {Array} obj
 */
export const a = obj => obj instanceof AtpArray ? obj : new AtpArray(obj);
