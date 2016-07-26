import IHandlableError from "./IHandlableError";
import {EventEmitter} from "events";
import IDObject from "./IDObject";

/**
 * EventEmitterをmixinしたIDObject
 */
class EEObject extends IDObject implements NodeJS.EventEmitter {
    public addListener: (event: string, listener: Function) => EventEmitter;
    public on: (event: string, listener: Function) => EventEmitter;
    public once: (event: string, listener: Function) => EventEmitter;
    public removeListener: (event: string, listener: Function) => EventEmitter;
    public removeAllListeners: (event?: string) => EventEmitter;
    public setMaxListeners: (n: number) => EventEmitter;
    public getMaxListeners: () => number;
    public listeners: (event: string) => Function[];
    public listenerCount: (type: string) => number;
    public emit: (event: string, ...args: any[]) => boolean;
    public emitException(eventName: string, error: IHandlableError): void {
        error.handled = false;
        const listeners = this.listeners(eventName);
        for (let i = 0; i < listeners.length; i++) {
            listeners[listeners.length - i - 1](error);
            if (error.handled) {
                return;
            }
        }
        if (eventName !== "error") {
            this.emitException("error", error);
        } else {
            throw error;
        }
    }

    constructor() {
        super();
    }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

applyMixins(EEObject, [EventEmitter]);

export default EEObject;
