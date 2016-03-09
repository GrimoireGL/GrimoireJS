import JThreeObject from "../Base/JThreeObject";
import GomlNodeDictionary from "../Goml/GomlNodeDictionary";
import ContextComponents from "../ContextComponents";
import BehaviorRegistry from "./Behaviors/BehaviorRegistry";
import GomlConfigurator from "./GomlConfigurator";
import BehaviorRunner from "./Behaviors/BehaviorRunner";
import JThreeContext from "../JThreeContext";
import AttributePromiseRegistry from "./AttributePromiseRegistry";
class NodeManager extends JThreeObject {
    constructor() {
        super();
        this.nodeRegister = new GomlNodeDictionary();
        this.attributePromiseRegistry = new AttributePromiseRegistry();
        this.nodesById = {};
        this.behaviorRegistry = new BehaviorRegistry();
        this.behaviorRunner = new BehaviorRunner();
        this.ready = false;
        /**
         * this configurator will load any tag information by require.
         */
        this.configurator = new GomlConfigurator();
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(3000, () => this.update());
    }
    getContextComponentIndex() {
        return ContextComponents.NodeManager;
    }
    update() {
        if (!this.ready) {
            return;
        }
        this.gomlRoot.callRecursive((v) => v.update());
        this.behaviorRunner.executeForAllBehaviors("updateBehavior");
    }
    getNode(id) {
        return this.nodesById[id];
    }
    getNodeByElement(elem) {
        const id = elem.getAttribute("x-j3-id");
        return this.getNode(id);
    }
    getElementByNode(node) {
        return node.props.getProp("elem");
    }
    /**
     * get Node by query inside context
     * @param  {string}             query   query string.
     * @param  {GomlTreeNodeBase}   context target Node that search for by query.
     * @return {GomlTreeNodeBase[]}         result Node
     */
    getNodeByQuery(query, context) {
        const result = [];
        const target = context ? context.props.getProp("elem") : this.htmlRoot;
        const found = target.querySelectorAll(query);
        for (let index = 0; index < found.length; index++) {
            const id = found[index].getAttribute("x-j3-id");
            result.push(this.getNode(id));
        }
        return result;
    }
}
export default NodeManager;
