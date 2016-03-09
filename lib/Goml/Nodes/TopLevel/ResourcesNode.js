import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class ResourcesNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "resource";
    }
    get loadPriorty() {
        return 3000;
    }
}
export default ResourcesNode;
