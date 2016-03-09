import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class CanvasesNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
    }
    get loadPriorty() {
        return 2000;
    }
}
export default CanvasesNode;
