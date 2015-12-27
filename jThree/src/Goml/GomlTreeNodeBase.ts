import AttributeDictionary = require("./AttributeDictionary");
import TreeNodeBase = require('./TreeNodeBase');
import JThreeContext = require("../JThreeContext");
import NodeManager = require('./NodeManager');
import ContextComponents = require('../ContextComponents');
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import Delegates = require("../Base/Delegates");

/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends TreeNodeBase {
  /**
   * コンストラクタ内ではattributeの定義、attributeの変化時のイベント、child, parentが更新された際のイベントを設定します。
   */
  constructor() {
    super();

    //load node manager
    this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

    //after configuration, this node is going to add to NodesById
    this.nodeManager.NodesById.set(this.ID, this);
    this.attributes = new AttributeDictionary(this);

    // apply attributes
    this.on('node-mount-process-finished', (mounted) => {
      if (mounted) {
        this.attributes.forEachAttr((ga) => {
          ga.initialize();
        })
      }
    });
  }

  /**
   * node manager
   * @type {NodeManager}
   */
  public nodeManager: NodeManager;

  /**
   * Attributes this node have.
   */
  public attributes: AttributeDictionary;

  /**
   * components that is attached to this node.
   */
  protected behaviors: AssociativeArray<BehaviorNode[]> = new AssociativeArray<BehaviorNode[]>();

  /**
   * Add component to this node.
   */
  public addBehavior(behaviors: BehaviorNode): void {
    this.nodeManager.behaviorRunner.addBehavior(behaviors, this);
    if (!this.behaviors.has(behaviors.BehaviorName)) this.behaviors.set(behaviors.BehaviorName, []);
    this.behaviors.get(behaviors.BehaviorName).push(behaviors);
  }

  public getBehaviors(behaviorName: string): BehaviorNode[] {
    return this.behaviors.get(behaviorName);
  }
}

export = GomlTreeNodeBase;
