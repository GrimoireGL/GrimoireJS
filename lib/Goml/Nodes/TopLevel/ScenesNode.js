import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class ScenesNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "scene";
    }
    get loadPriorty() {
        return 5000;
    }
}
export default ScenesNode;
