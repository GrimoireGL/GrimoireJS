import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class LoadersNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
    }
    get loadPriorty() {
        return 1000;
    }
}
export default LoadersNode;
