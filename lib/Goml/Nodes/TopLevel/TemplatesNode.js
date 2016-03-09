import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class TemplatesNode extends OrderedTopLevelNodeBase {
    constructor() {
        super();
    }
    get loadPriorty() {
        return 4000;
    }
}
export default TemplatesNode;
