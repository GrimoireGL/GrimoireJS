///<reference path="../../node_modules/@types/node/index.d.ts"/>
import {EventEmitter} from "events";
import IDObject from "./IDObject";

/**
 * EventEmitterをmixinしたIDObject
 */
class EEObject extends IDObject implements NodeJS.EventEmitter {
  public prependListener: (event: string, listener: Function) => this;
  public prependOnceListener: (event: string, listener: Function) => this;
  public eventNames: () => string[];
  public addListener: (event: string, listener: Function) => this;
  public on: (event: string, listener: Function) => this;
  public once: (event: string, listener: Function) => this;
  public removeListener: (event: string, listener: Function) => this;
  public removeAllListeners: (event?: string) => this;
  public setMaxListeners: (n: number) => this;
  public getMaxListeners: () => number;
  public listeners: (event: string) => Function[];
  public listenerCount: (type: string) => number;
  public emit: (event: string, ...args: any[]) => boolean;
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
