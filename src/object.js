import typeOf from 'typeof';
import flags from './flag';

export const mergeFlags = flags(["RECURSIVE", "CONCAT_ARRAYS"]);

/**
 * Syntactic sugar functions for Objects
 *
 */
export class AtpObject
{
    constructor(obj) {
        this.raw = obj;
    }

    /**
     * Funcional-style assignment:  Takes the result of an expression and passes it to the given function, returning the function's result.
     * @param {Any} f
     * @returns {Any}
     * @example o(1 + 2).as(sum => sum * 3) == 9
     */
    as(f) {
        return f(this.raw);
    }

    /**
     * Logs the current object to the console, then returns it so method chaining can continue.
     * This allows the developer to see intermediate results in a chain of function calls without disturbing the chain.
     * @returns {AtpObject}
     */
    debug() {
        console.log(this.raw);
        return this;
    }

    /**
     * Filters an object like an array, keeping key=>value associations
     * @param {Function} f - The filter function, which should take the value, key, and whole object as params and return a boolean
     * @returns {AtpObject}
     * @example o({a: 1, b: 2, c: 3}).filter(num => num % 2 > 0) == {a: 1, c: 3}
     */
    filter(f) {
        return this.mergeReduce((item, key, obj) => f(item, key, obj) ? {[key]: item} : {});
    }

    /**
     * Gets the keys of an object
     * @returns {Array}
     */
    keys() {
        return typeOf(this.raw) === 'object' ? Object.keys(this.raw) : [];
    }

    /**
     * Maps an object like an array, keeping key=>mapped value associations
     * @param {Function} m - The mapper function, which should take the value, key, and whole object as params and return a new value
     * @returns {AtpObject}
     * @example o({a:1, b:2, c:3}).map(n => n * 2) == {a:2, b: 4, c:6}
     */
    map(m) {
        return this.mergeReduce((item, key) => ({[key]: m(item, key, this.raw)}));
    }

    /**
     * Merges two objects.  By default, objects are merged recursively and arrays are concatenated.
     * This behavior can be altered by sending the appropriate flags.
     * Other values in the original object are replaced by the corresponding values in the second object.
     * @param {Object} other - The object to merge with
     * @param {Bitfield} flags
     * @returns {AtpObject} - The merged object
     */
    merge(other, flags = (mergeFlags.RECURSIVE | mergeFlags.CONCAT_ARRAYS)) {
        let merged = Object.assign({}, this.raw);
        other = o(other).raw;
        for(const key in other) {
            switch(typeOf(other[key])) {
                case 'object':
                    merged[key] = typeOf(merged[key]) === 'object' && mergeFlags.matches(flags, "RECURSIVE")
                        ? o(merged[key]).merge(other[key], flags).raw
                        : other[key];
                    break;
                case 'array':
                    merged[key] = typeOf(merged[key]) === 'array' && mergeFlags.matches(flags, "CONCAT_ARRAYS")
                        ? merged[key].concat(other[key])
                        : other[key];
                    break;
                default:
                    merged[key] = other[key];
            }
        }

        return o(merged);
    }

    /**
     * Reduces an object like an array.  Both keys and values are available to the reducer
     * @param {Function} f - A reducer function that also recieve the key as a third parameter
     * @param {Any} initialValue - The initial value for the reducer
     * @returns {Any}
     */
    reduce(f, initialValue) {
        return typeof initialValue === 'undefined'
            ? Object.keys(this.raw).slice(1).reduce(
                (combined, key) => f(combined, this.raw[key], key),
                this.raw[Object.keys(this.raw)[0]]
            )
            : Object.keys(this.raw).reduce(
                (combined, key) => f(combined, this.raw[key], key),
                initialValue
            );
    }

    /**
     * Maps a function onto the elements of an object and merges the results into a single new object.
     * o(obj).mergeReduce(f) === o(obj).map(f).reduce((a, b) => a.merge(b), o({}))
     * @param {Function} f - A mapper function
     * @returns {AtpObject}
     */
    mergeReduce(f) {
        return Object.keys(this.raw).reduce(
            (combined, key) => combined.merge(f(this.raw[key], key, this.raw)),
            o({})
        )
    }

    /**
     * A functional switch statement.  The value of the switch statement will be the return value of whichever action is run.
     * @param {Object} actions - Actions should be an object whose keys are the possible values of the switch variable
     * and whose values are functions that return the desired final value.
     * Actions may optionally include a 'default' function that will run if no other values are met
     * @returns {Any}
     * @example const mode = "json";
     * o(mode).switch({
     *  html: () => "<h1>Hello World!</h1>",
     *  json: () => ({msg: "Hello World!}),
     *  default: () => "Invalid format"
     * }) == {msg: "Hello World!}
     */
    switch(actions) {
        return (actions[this.raw] || actions.default || (() => undefined))();
    }

    /**
     * Returns a new object with the specified field deleted
     * @param {String} name - The field to delete
     */
    delete(name) {
        let newObj = Object.assign({}, this.raw);
        delete newObj[name];
        return o(newObj);
    }

    /**
     * Returns the values of the object as an array
     * @returns {Array}
     */
    values() {
        return Object.values(this.raw);
    }
}

/**
 * Wrap the given object to make the syntactic sugar functionas available
 * @param obj
 */
export const o = obj => obj instanceof AtpObject ? obj : new AtpObject(obj);
