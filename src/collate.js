export const collate = (obj, valueFunc, nextFunc, conditional) => {
    let results = [];
    while(conditional(obj)) {
        results.push(valueFunc(obj));
        obj = nextFunc(obj);
    }
    return results;
};
