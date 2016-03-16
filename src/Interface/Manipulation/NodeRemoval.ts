import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Filter from "../Static/Filter";
import NodeOperator from "../Static/NodeOperation";
import isUndefined from "lodash.isundefined";

class NodeRemoval extends J3ObjectBase {
  public remove(): J3Object;
  public remove(filter: string): J3Object;
  public remove(argu?: string): any {
    const target = Filter.filter(this.__getArray(), argu, ["selector"]);
    NodeOperator.remove(target);
    return this;
  }
}

export default NodeRemoval;
