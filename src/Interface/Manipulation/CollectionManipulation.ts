import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";

const BreakException = {};

class CollectionManipulation extends J3ObjectBase {
  public each(func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
  public each(func: (index: number, node: GomlTreeNodeBase) => void): J3Object;
  public each(func: (index: number, node: GomlTreeNodeBase) => any): J3Object {
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

export default CollectionManipulation;
