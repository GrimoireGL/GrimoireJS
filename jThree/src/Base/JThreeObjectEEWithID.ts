import events = require('events');
import JThreeObjectWithID = require('./JThreeObjectWithID');

/**
 * EventEmitterをmixinしたJThreeObjectWithID
 */
class JThreeObjectEEWithID extends JThreeObjectWithID implements events.EventEmitter {
  addListener: (event: string, listener: Function) => events.EventEmitter;
  on: (event: string, listener: Function) => events.EventEmitter;
  once: (event: string, listener: Function) => events.EventEmitter;
  removeListener: (event: string, listener: Function) => events.EventEmitter;
  removeAllListeners: (event?: string) => events.EventEmitter;
  setMaxListeners: (n: number) => void;
  listeners: (event: string) => Function[];
  emit: (event: string, ...args: any[]) => boolean;

  constructor(id?:string) {
    super(id);
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    })
  });
}

applyMixins(JThreeObjectEEWithID, [events.EventEmitter]);

export = JThreeObjectEEWithID;
