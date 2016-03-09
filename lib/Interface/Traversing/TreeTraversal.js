import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";
class TreeTraversal extends J3ObjectBase {
    find(argu) {
        switch (true) {
            case (isString(argu)):
                let ret_node = [];
                this.__getArray().forEach((node) => {
                    ret_node = ret_node.concat(J3Object.find(argu, node));
                });
                return new J3Object(ret_node);
            case (argu instanceof GomlTreeNodeBase):
                throw new Error("Not implemented yet");
            case (argu instanceof J3Object):
                throw new Error("Not implemented yet");
            default:
                throw new Error("Argument type is not correct");
        }
    }
}
export default TreeTraversal;
