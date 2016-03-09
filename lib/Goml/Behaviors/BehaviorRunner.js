import JThreeObject from "../../Base/JThreeObject";
import JThreeCollection from "../../Base/JThreeCollection";
import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
/**
 * container class for storeing BehaviorNode and TargetNode
 */
class BehaviorNodePair extends JThreeObjectWithID {
    constructor(behavior, target) {
        super(behavior.ID);
        this._behavior = behavior;
        this._targetNode = target;
    }
    /**
     * getter for component node
     */
    get Behavior() {
        return this._behavior;
    }
    /**
     * getter for target node
     */
    get Target() {
        return this._targetNode;
    }
}
class BehaviorRunner extends JThreeObject {
    constructor(...args) {
        super(...args);
        this._dictionary = new JThreeCollection();
        this._sortedBehavior = [];
    }
    addBehavior(node, target) {
        const componentPair = new BehaviorNodePair(node, target);
        this._dictionary.insert(componentPair);
        this._sortedBehavior.push(componentPair);
        this._sortBehaviors();
        if (!node.awaken) {
            node.awake.call(node, target);
        }
    }
    executeForAllBehaviors(behaviorName) {
        this._sortedBehavior.forEach(v => {
            if (v.Behavior.enabled) {
                v.Behavior[behaviorName](v.Target);
            }
        });
    }
    _sortBehaviors() {
        this._sortedBehavior.sort((v1, v2) => v1.Behavior.order - v2.Behavior.order);
    }
}
export default BehaviorRunner;
