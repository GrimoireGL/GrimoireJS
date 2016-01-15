import events = require("events");
import JThreeObjectWithID = require("./JThreeObjectWithID");

/**
 * EventEmitterをmixinしたJThreeObjectWithID
 */
class JThreeObjectEEWithID extends JThreeObjectWithID implements events.EventEmitter {
    public addListener: (event: string, listener: Function) => events.EventEmitter;
    public on: (event: string, listener: Function) => events.EventEmitter;
    public once: (event: string, listener: Function) => events.EventEmitter;
    public removeListener: (event: string, listener: Function) => events.EventEmitter;
    public removeAllListeners: (event?: string) => events.EventEmitter;
    public setMaxListeners: (n: number) => void;
    public listeners: (event: string) => Function[];
    public emit: (event: string, ...args: any[]) => boolean;

    constructor(id?: string) {
        super(id);
    }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

applyMixins(JThreeObjectEEWithID, [events.EventEmitter]);

export = JThreeObjectEEWithID;
