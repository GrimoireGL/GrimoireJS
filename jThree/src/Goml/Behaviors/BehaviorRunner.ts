import JThreeObject = require("../../Base/JThreeObject");
import JThreeCollection = require("../../Base/JThreeCollection");
import BehaviorNode = require("../Nodes/Behaviors/BehaviorNode");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
/**
 * container class for storeing BehaviorNode and TargetNode
 */
class BehaviorNodePair extends JThreeObjectWithID {
  /**
   * BehaviortNode contain the arguments of behavior.
   */
  private behavior: BehaviorNode;

  /**
   * TargetNode contain the ComponentNode
   */
  private targetNode: GomlTreeNodeBase;

  constructor(behavior: BehaviorNode, target: GomlTreeNodeBase) {
    super(behavior.ID);
    this.behavior = behavior;
    this.targetNode = target;
  }
  /**
   * getter for component node
   */
  public get Behavior(): BehaviorNode {
    return this.behavior;
  }
  /**
   * getter for target node
   */
  public get Target(): GomlTreeNodeBase {
    return this.targetNode;
  }
}

class BehaviorRunner extends JThreeObject {
  private dictionary: JThreeCollection<BehaviorNodePair> = new JThreeCollection<BehaviorNodePair>();

  private sortedBehavior: BehaviorNodePair[] = [];

  public addBehavior(node: BehaviorNode, target: GomlTreeNodeBase) {
    const componentPair = new BehaviorNodePair(node, target);
    this.dictionary.insert(componentPair);
    this.sortedBehavior.push(componentPair);
    this.sortBehaviors();
    if (!node.awaken) {
      node.awake.call(node, target);
    }
  }

  public executeForAllBehaviors(behaviorName: string) {
    this.sortedBehavior.forEach(v => {
      if (v.Behavior.enabled) {
        v.Behavior[behaviorName](v.Target);
      }
    });
  }

  private sortBehaviors() {
    this.sortedBehavior.sort((v1, v2) => v1.Behavior.order - v2.Behavior.order);
  }
}
export = BehaviorRunner;
