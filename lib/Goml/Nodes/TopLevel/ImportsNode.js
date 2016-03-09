import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class CanvasesNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "import";
    }
    get loadPriorty() {
        return 0;
    }
}
export default CanvasesNode;
