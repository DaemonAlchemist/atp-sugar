/**
 * Created by Andy on 7/9/2017.
 */

export const collate = (obj, valueFunc, nextFunc, conditional) => {
    let results = [];
    while(conditional(obj)) {
        results.push(valueFunc(obj));
        obj = nextFunc(obj);
    }
    return results;
};
