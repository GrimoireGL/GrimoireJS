import isArray from "lodash.isarray";
import J3Object from "../J3Object";
const BreakException = {};
class Utilities {
    static each(argu0, callback) {
        try {
            if (isArray(argu0) || argu0 instanceof J3Object) {
                Array.prototype.forEach.call(argu0, (value, indexInArray) => {
                    const ret = callback.bind(value)(indexInArray, value);
                    if (ret === false) {
                        throw BreakException;
                    }
                });
            }
            else {
                Object.keys(argu0).forEach((propertyName, index) => {
                    const valueOfProperty = argu0[propertyName];
                    const ret = callback.bind(valueOfProperty)(propertyName, valueOfProperty);
                    if (ret === false) {
                        throw BreakException;
                    }
                });
            }
        }
        catch (e) {
            if (e !== BreakException) {
                throw e;
            }
        }
        return argu0;
    }
}
export default Utilities;
