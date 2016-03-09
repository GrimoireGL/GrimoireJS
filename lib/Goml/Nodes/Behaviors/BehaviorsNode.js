import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class BehaviorsNode extends GomlTreeNodeBase {
    constructor() {
        super();
    }
    __onMount() {
        super.__onMount();
        this._componentTarget = this.__parent;
    }
    get ComponentTarget() {
        return this._componentTarget;
    }
}
export default BehaviorsNode;
