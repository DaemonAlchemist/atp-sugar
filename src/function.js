import {AtpObject, o} from './object';

/**
 * Convenience wrapper around setTimeout
 * @class DelayedEvent
 * @param {Function} callback - the function to delay
 * @example f(func).delay().for(5).seconds();
 */
class DelayedEvent {
    constructor(callback) {
        this.callback = callback;
        this.event = null;
        this.delay = 0;
    }

    /**
     * Cancel the delayed function.  Note that the DelayedEvent can be re-queued by calling runIn() again.
     * @returns {DelayedEvent}
     */
    cancel() {
        clearTimeout(this.event);
        return this;
    }

    /**
     * Synonym for runIn, useful in fluent expressions
     * @param {Number} delay - The time to delay the function's execution, modifiable with subsequent interval calls
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).seconds();
     */
    for(delay) {
        return this.runIn(delay);
    }

    /**
     * Set (or reset) the delay of the function
     * @param {Number} delay - The time to delay the function's execution, modifiable with subsequent interval calls
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).seconds();
     */
    runIn(delay) {
        return this._runIn(delay, true);
    }

    _runIn(delay, save = true) {
        if(save) this.delay = delay;
        this.cancel();
        this.event = setTimeout(this.callback, delay);
        return this;
    }

    /**
     * Interpret the previously specified delay as a delay in milliseconds
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).milliseconds();
     */
    milliseconds() {return this;}

    /**
     * Interpret the previously specified delay as a delay in seconds
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).seconds();
     */
    seconds() {this._runIn(this.delay                * 1000, false); return this;}

    /**
     * Interpret the previously specified delay as a delay in minutes
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).minutes();
     */
    minutes() {this._runIn(this.delay           * 60 * 1000, false); return this;}

    /**
     * Interpret the previously specified delay as a delay in hours
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).hours();
     */
    hours()   {this._runIn(this.delay      * 60 * 60 * 1000, false); return this;}

    /**
     * Interpret the previously specified delay as a delay in days
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).days();
     */
    days()    {this._runIn(this.delay * 24 * 60 * 60 * 1000, false); return this;}
}
/**
 * A wrapper for convenient functions related to functions
 *
 * @class ATPFunction
 */
export class AtpFunction extends AtpObject
{
    /**
     * Convenience method for setTimeout() allowing for a more fluid style
     * @returns {DelayedEvent}
     * @example f(func).delay().for(5).seconds();
     */
    delay() {
        return new DelayedEvent(this.raw);
    }
}

/**
 * Wrap the specified function in an ATPFunction object
 *
 * @param {Function} func
 */
export const f = func => func instanceof AtpFunction ? func : new AtpFunction(func);
