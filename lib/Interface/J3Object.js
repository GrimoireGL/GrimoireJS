import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import J3ObjectBase from "./J3ObjectBase";
import isArray from "lodash.isarray";
import isString from "lodash.isstring";
/**
 * Provides jQuery like API for jThree.
 */
class J3Object extends J3ObjectBase {
    /**
     * Construct J3Object from Nodes or selector query.
     * @param {GomlTreeNodeBase[]} nodes [description]
     */
    constructor(argu) {
        super();
        let nodes;
        let query;
        switch (true) {
            case (isString(argu)):
                query = argu;
                break;
            case (argu instanceof GomlTreeNodeBase):
                nodes = [argu];
                break;
            case (isArray(argu) && argu.every((v) => v instanceof GomlTreeNodeBase)):
                nodes = argu;
                break;
            default:
                throw new Error("Argument type is not correct");
        }
        if (nodes) {
            this.__setArray(nodes);
        }
        else if (query) {
            this.__setArray(J3Object.find(query));
        }
    }
}
export default J3Object;
