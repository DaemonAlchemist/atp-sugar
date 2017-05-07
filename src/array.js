/**
 * Created by awittrock on 4/12/2017.
 */

import {AtpObject, o} from "./object";

export class AtpArray extends AtpObject
{
    difference(other) {
        return this.raw.filter(item => !other.includes(item));
    }

    intersect(other) {
        return this.raw.filter(item => other.includes(item));
    }

    sortBy(fieldName) {
        return this.raw.sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
    }

    partition(partitionFunc) {
        return o(this,reduce((partitioned, cur) => o(partitionFunc(cur)).as(key =>
            Object.assign({}, partitioned, {[key]: partitioned[key] ? partitioned[key].concat(cur) : [cur]})
        ), {}));
    }
}

export const a = obj => obj instanceof AtpArray ? obj : new AtpArray(obj);
