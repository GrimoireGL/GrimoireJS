import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import isString from "lodash.isstring";
import isArray from "lodash.isarray";
class Filtering extends J3ObjectBase {
    filter(argu) {
        switch (true) {
            case (isString(argu)):
                return;
            case (isArray(argu) && (argu.every((v) => v instanceof GomlTreeNodeBase))):
                throw new Error("Not implemented yet");
            case (argu instanceof GomlTreeNodeBase):
                throw new Error("Not implemented yet");
            case (argu instanceof J3Object):
                throw new Error("Not implemented yet");
            default:
                throw new Error("Argument type is not correct");
        }
    }
}
