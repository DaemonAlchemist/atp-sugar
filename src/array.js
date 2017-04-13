/**
 * Created by awittrock on 4/12/2017.
 */

import {AtpObject} from "./object";

export class AtpArray extends AtpObject
{
    sortBy(fieldName) {
        return this.raw.sort((a, b) => a[fieldName].localeCompare(b[fieldName]));
    }
}

export const a = obj => obj instanceof AtpArray ? obj : new AtpArray(obj);
