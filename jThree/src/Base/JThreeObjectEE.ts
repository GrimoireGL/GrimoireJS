import events = require('events');
import JThreeObject = require('./JThreeObject');

/**
 * EventEmitterを継承したJThreeObject
 */
class JThreeObjectEE extends events.EventEmitter implements JThreeObject {
  public toString: () => string;
  public getTypeName: () => string;

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

applyMixins(JThreeObjectEE, [JThreeObject]);

export = JThreeObjectEE;
