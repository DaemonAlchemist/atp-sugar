/**
 * Created by awittrock on 4/12/2017.
 */

import typeOf from "typeof";
import flags from "./flag";

export const mergeFlags = flags(["RECURSIVE", "CONCAT_ARRAYS"]);

export class AtpObject
{
    constructor(obj) {
        this.raw = obj;
    }

    as(f) {
        return f(this.raw);
    }

    debug() {
        console.log(this.raw);
        return this;
    }

    map(m) {
        return this.mergeReduce((item, key) => ({[key]: m(item, key, this.raw)}));
    }

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

    mergeReduce(f) {
        return Object.keys(this.raw).reduce(
            (combined, key) => combined.merge(f(this.raw[key], key, this.raw)),
            o({})
        )
    }
    switch(actions) {
        return (actions[this.raw] || actions.default || (() => undefined))();
    }
}

export const o = obj => obj instanceof AtpObject ? obj : new AtpObject(obj);
