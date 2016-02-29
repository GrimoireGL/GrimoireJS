import JThreeObject from "../../Base/JThreeObject";
import JThreeCollection from "../../Base/JThreeCollection";
import BehaviorNode from "../Nodes/Behaviors/BehaviorNode";
import GomlTreeNodeBase from "../GomlTreeNodeBase";
import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
/**
 * container class for storeing BehaviorNode and TargetNode
 */
class BehaviorNodePair extends JThreeObjectWithID {
  /**
   * BehaviortNode contain the arguments of behavior.
   */
  private _behavior: BehaviorNode;

  /**
   * TargetNode contain the ComponentNode
   */
  private _targetNode: GomlTreeNodeBase;

  constructor(behavior: BehaviorNode, target: GomlTreeNodeBase) {
    super(behavior.ID);
    this._behavior = behavior;
    this._targetNode = target;
  }
  /**
   * getter for component node
   */
  public get Behavior(): BehaviorNode {
    return this._behavior;
  }
  /**
   * getter for target node
   */
  public get Target(): GomlTreeNodeBase {
    return this._targetNode;
  }
}

class BehaviorRunner extends JThreeObject {
  private _dictionary: JThreeCollection<BehaviorNodePair> = new JThreeCollection<BehaviorNodePair>();

  private _sortedBehavior: BehaviorNodePair[] = [];

  public addBehavior(node: BehaviorNode, target: GomlTreeNodeBase): void {
    const componentPair = new BehaviorNodePair(node, target);
    this._dictionary.insert(componentPair);
    this._sortedBehavior.push(componentPair);
    this._sortBehaviors();
    if (!node.awaken) {
      node.awake.call(node, target);
    }
  }

  public executeForAllBehaviors(behaviorName: string): void {
    this._sortedBehavior.forEach(v => {
      if (v.Behavior.enabled) {
        v.Behavior[behaviorName](v.Target);
      }
    });
  }

  private _sortBehaviors(): void {
    this._sortedBehavior.sort((v1, v2) => v1.Behavior.order - v2.Behavior.order);
  }
}
export default BehaviorRunner;
