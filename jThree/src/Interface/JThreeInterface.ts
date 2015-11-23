import JThreeObject = require("../Base/JThreeObject");
import Timer = require("../Core/Timer");
import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import Delegate = require("../Base/Delegates");
import AttrInterface = require('./Common/AttrInterface');

/**
 * Provides jQuery like API for jThree.
 */
class JThreeInterface implements AttrInterface {
  constructor(query: string) {
    super();
    var targetObject: NodeList = this.nodeManager.htmlRoot.querySelectorAll(<string>query); //call as query
    this.target = ;
    this.
  }
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

export = JThreeInterface;
