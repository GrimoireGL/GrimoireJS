import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
    constructor() {
        super();
    }
    get loadPriorty() {
        return 0;
    }
}
export default OrderedTopLevelNodeBase;
