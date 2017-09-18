/**
 * Created by Andy on 4/12/2017.
 */

import {AtpObject, o} from './object';

class DelayedEvent {
    constructor(callback) {
        this.callback = callback;
        this.event = null;
        this.delay = 0;
    }

    cancel() {
        clearTimeout(this.event);
        return this;
    }

    runIn(delay, save = true) {
        if(save) this.delay = delay;
        this.cancel();
        this.event = setTimeout(this.callback, delay);
        return this;
    }

    milliseconds() {return this;}
    seconds() {this.runIn(this.delay                * 1000, false); return this;}
    minutes() {this.runIn(this.delay           * 60 * 1000, false); return this;}
    hours()   {this.runIn(this.delay      * 60 * 60 * 1000, false); return this;}
    days()    {this.runIn(this.delay * 24 * 60 * 60 * 1000, false); return this;}
}

export class AtpFunction extends AtpObject
{
    delay() {
        return new DelayedEvent(this.raw);
    }
}

export const f = func => func instanceof AtpFunction ? func : new AtpFunction(func);
