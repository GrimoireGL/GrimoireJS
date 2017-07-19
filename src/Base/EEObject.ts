import { EventEmitter, ListenerFn } from "eventemitter3";
import IDObject from "./IDObject";

/**
 * EventEmitterをmixinしたIDObject
 */
class EEObject extends IDObject implements EventEmitter {
  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  public eventNames: () => Array<string | symbol>;

  /**
   * Return the listeners registered for a given event.
   */
  public listeners: ((event: string | symbol, exists: boolean) => Array<ListenerFn> | boolean) & ((event: string | symbol) => Array<ListenerFn>);

  /**
   * Calls each of the listeners registered for a given event.
   */
  public emit: (event: string | symbol, ...args: Array<any>) => boolean;

  /**
   * Add a listener for a given event.
   */
  public on: (event: string | symbol, fn: ListenerFn, context?: any) => this;
  public addListener: (event: string | symbol, fn: ListenerFn, context?: any) => this;

  /**
   * Add a one-time listener for a given event.
   */
  public once: (event: string | symbol, fn: ListenerFn, context?: any) => this;

  /**
   * Remove the listeners of a given event.
   */
  public removeListener: (event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean) => this;
  public off: (event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean) => this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  public removeAllListeners: (event?: string | symbol) => this;
  constructor() {
    super();
    EventEmitter.call(this);
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
