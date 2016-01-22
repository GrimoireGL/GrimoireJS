import events = require("events");
import JThreeObject = require("./JThreeObject");

/**
 * EventEmitterをmixinしたJThreeObject
 */
class JThreeObjectEE extends JThreeObject implements events.EventEmitter {
  public addListener: (event: string, listener: Function) => events.EventEmitter;
  public on: (event: string, listener: Function) => events.EventEmitter;
  public once: (event: string, listener: Function) => events.EventEmitter;
  public removeListener: (event: string, listener: Function) => events.EventEmitter;
  public removeAllListeners: (event?: string) => events.EventEmitter;
  public setMaxListeners: (n: number) => void;
  public listeners: (event: string) => Function[];
  public emit: (event: string, ...args: any[]) => boolean;

  constructor() {
    super();
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(JThreeObjectEE, [events.EventEmitter]);

export = JThreeObjectEE;
