/**
 * Created by Andy on 4/6/2017.
 */

export default flagNames => flagNames
    .map((flag, index) => ({[flag]: Math.pow(2, index)}))
    .reduce((combined, cur) => Object.assign({}, combined, cur), {NONE: 0})
    .$as(flags => Object.assign({}, flags, {
        matches: (flag, match) =>  (flag & flags[match]) == flags[match]
    }));