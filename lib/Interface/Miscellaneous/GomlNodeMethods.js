import J3ObjectBase from "../J3ObjectBase";
import CoreRelatedNodeBase from "../../Goml/CoreRelatedNodeBase";
import isNumber from "lodash.isnumber";
import isUndefiend from "lodash.isundefined";
class GomlNodeMethods extends J3ObjectBase {
    get(argu) {
        switch (true) {
            case (isNumber(argu)):
                return this[argu];
            case (isUndefiend(argu)):
                return this.__getArray();
            default:
                throw new Error("Argument type is not correct");
        }
    }
    getObj(argu) {
        switch (true) {
            case (isNumber(argu)):
                const node = this[argu];
                return node instanceof CoreRelatedNodeBase ? node.target : null;
            case (isUndefiend(argu)):
                return this.__getArray().map((node) => {
                    return node instanceof CoreRelatedNodeBase ? node.target : null;
                });
            default:
                throw new Error("Argument type is not correct");
        }
    }
    index(argu) {
        throw new Error("Not implemented yet");
    }
}
export default GomlNodeMethods;
