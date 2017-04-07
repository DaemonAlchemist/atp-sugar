/**
 * Created by Andy on 3/16/2017.
 */

import typeOf from "typeof";
import flags from "./flag";

if(!Array.prototype.$intersect) {
    Object.defineProperty(Array.prototype, '$intersect', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(other) {
            return this.filter(elem => other.includes(elem));
        }
    })
}

if(!Array.prototype.$sortBy) {
    Object.defineProperty(Array.prototype, '$sortBy', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(fieldName) {
            return this.sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
        }
    });
}

if(!Object.prototype.$as) {
    Object.defineProperty(Object.prototype, '$as', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(f) {
            return f(this.valueOf());
        }
    })
}

export const mergeFlags = flags(["RECURSIVE", "CONCAT_ARRAYS"]);
if(!Object.prototype.$merge) {
    Object.defineProperty(Object.prototype, '$merge', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(other, flags = (mergeFlags.RECURSIVE | mergeFlags.CONCAT_ARRAYS)) {
            let merged = Object.assign({}, this);
            for(const key in other) {
                switch(typeOf(other[key])) {
                    case 'object':
                        merged[key] = typeOf(merged[key]) === 'object' && mergeFlags.matches(flags, "RECURSIVE")
                            ? merged[key].$merge(other[key], flags)
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

            return merged;
        }
    })
}

if(!Object.prototype.$filter) {
    Object.defineProperty(Object.prototype, '$filter', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(f) {
            return this.$mergeReduce((item, key) => f(item, key, this) ? {[key]: item} : {});
        }
    })
}

if(!Object.prototype.$map) {
    Object.defineProperty(Object.prototype, '$map', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(m) {
            return this.$mergeReduce((item, key) => ({[key]: m(item, key, this)}));
        }
    })
}

if(!Object.prototype.$values) {
    Object.defineProperty(Object.prototype, '$values', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
            return Object.keys(this).map(key => this[key]);
        }
    });
}

if(!Object.prototype.$mergeReduce) {
    Object.defineProperty(Object.prototype, '$mergeReduce', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(f) {
            return Object.keys(this).reduce(
                (combined, key) => combined.$merge(f(this[key], key, this)),
                {}
            )
        }
    })
}

if(!Object.prototype.$switch) {
    Object.defineProperty(Object.prototype, '$switch', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(actions) {
            return (actions[this] || actions.default || (() => undefined))();
        }
    })
}