import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class GomlNode extends GomlTreeNodeBase {
    constructor() {
        super();
    }
    /**
     * Add child to this node
     */
    addChild(child) {
        super.addChild(child);
        this.__children.sort((n1, n2) => n1.loadPriorty - n2.loadPriorty);
    }
}
export default GomlNode;
