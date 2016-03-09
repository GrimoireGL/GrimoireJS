import J3ObjectBase from "../J3ObjectBase";
const BreakException = {};
class CollectionManipulation extends J3ObjectBase {
    each(func) {
        try {
            Array.prototype.forEach.call(this, (node, index) => {
                const ret = func.bind(node)(index, node);
                if (ret === false) {
                    throw BreakException;
                }
            });
        }
        catch (e) {
            if (e !== BreakException) {
                throw e;
            }
        }
        return this;
    }
}
export default CollectionManipulation;
