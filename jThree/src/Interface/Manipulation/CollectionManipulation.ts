import J3Object = require("../J3Object");
import J3ObjectBase = require("../J3ObjectBase");
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");

const BreakException = {};

class CollectionManipulation extends J3ObjectBase {
  public each(func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object {
    try {
      Array.prototype.forEach.call(this, (node: GomlTreeNodeBase, index: number) => {
        const ret = func.bind(node)(index, node);
        if (ret === false) {
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }
    return <any>this;
  }
}

export = CollectionManipulation;
