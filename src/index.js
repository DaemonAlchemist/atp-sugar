import {a} from './array';
import {o, mergeFlags} from './object';
import {f, DelayedEvent} from "./function";
import {collate} from './collate';

//Random helpers
const repeat = (count, f) => {
    for(let i=0; i<count; i++) {
        f();
    }
};

export {
    o, a, f, DelayedEvent, mergeFlags, collate,
    repeat
};
