import events = require('events');
import JThreeObject = require('./JThreeObject');

/**
 * EventEmitterをmixinしたJThreeObject
 */
class JThreeObjectEE extends JThreeObject implements events.EventEmitter {
  addListener: (event: string, listener: Function) => events.EventEmitter;
  on: (event: string, listener: Function) => events.EventEmitter;
  once: (event: string, listener: Function) => events.EventEmitter;
  removeListener: (event: string, listener: Function) => events.EventEmitter;
  removeAllListeners: (event?: string) => events.EventEmitter;
  setMaxListeners: (n: number) => void;
  listeners: (event: string) => Function[];
  emit: (event: string, ...args: any[]) => boolean;

  constructor() {
    super();
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    })
  });
}

applyMixins(JThreeObjectEE, [events.EventEmitter]);

export = JThreeObjectEE;
