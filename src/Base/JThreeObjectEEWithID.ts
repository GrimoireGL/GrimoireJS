import {EventEmitter} from "events";
import JThreeObjectWithID from "./JThreeObjectWithID";

/**
 * EventEmitterをmixinしたJThreeObjectWithID
 */
class JThreeObjectEEWithID extends JThreeObjectWithID implements EventEmitter {
  public addListener: (event: string, listener: Function) => EventEmitter;
  public on: (event: string, listener: Function) => EventEmitter;
  public once: (event: string, listener: Function) => EventEmitter;
  public removeListener: (event: string, listener: Function) => EventEmitter;
  public removeAllListeners: (event?: string) => EventEmitter;
  public setMaxListeners: (n: number) => void;
  public listeners: (event: string) => Function[];
  public emit: (event: string, ...args: any[]) => boolean;

  constructor(id?: string) {
    super(id);
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(JThreeObjectEEWithID, [EventEmitter]);

export default JThreeObjectEEWithID;
