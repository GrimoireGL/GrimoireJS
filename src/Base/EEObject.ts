import { EventEmitter, ListenerFn } from "eventemitter3";
import { EventID } from "../Core/Constants";
import IDObject from "./IDObject";

/**
 * EventEmitterをmixinしたIDObject
 */
class EEObject extends IDObject {
  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  public eventNames: () => (string | symbol)[];

  /**
   * Return the listeners registered for a given event.
   */
  public listeners: ((event: string | symbol, exists: boolean) => ListenerFn[] | boolean) & ((event: string | symbol) => ListenerFn[]);

  /**
   * Return the numbers of listeners.
   */
  public listenerCount: (event: string | symbol) => number;

  /**
   * add listener
   */
  public addListener: (event: string | symbol, fn: ListenerFn, context?: any) => this;

  /**
   * Add a one-time listener for a given event.
   */
  public once: (event: string | symbol, fn: ListenerFn, context?: any) => this;

  /**
   * Remove the listeners of a given event.
   */
  public removeListener: (event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean) => this;

  /**
   * remove listener.
   */
  public off: (event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean) => this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  public removeAllListeners: (event?: string | symbol) => this;

  constructor() {
    super();
    EventEmitter.call(this);
  }

  /**
   * Calls each of the listeners registered for a given event.
   */
  public emit<T>(event: EventID<T> | string | symbol, args: T): boolean {
    throw new Error("this method will be override.");
  }

  /**
   * Add a listener for a given event.
   */
  public on<T= any>(event: EventID<T> | string | symbol, fn: (args: T) => void, context?: any): this {
    throw new Error("this method will be override.");
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
