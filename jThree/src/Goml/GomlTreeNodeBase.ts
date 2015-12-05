import AttributeDictionary = require("./AttributeDictionary");
import TreeNodeBase = require('./TreeNodeBase');
import JThreeContext = require("../JThreeContext");
import NodeManager = require('./NodeManager');
import ContextComponents = require('../ContextComponents');
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends TreeNodeBase
{
  constructor() {
    super();

    //load node manager
    this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

    //after configuration, this node is going to add to NodesById
    this.nodeManager.NodesById.set(this.ID, this);
    this.attributes = new AttributeDictionary(this);
  }

  protected defineAttribute(attr: string, define: {[key: string]: any}): void
  {
    // TODO: validation
  }

  protected setAttr(attr: {[key: string]: any}): void;
  protected setAttr(key: string, value: any): void;
  protected setAttr(attr_key: {[key: string]: any} | string, value?: any): void
  {
    // need check necessarity of update
    let attr = {}
    if (typeof attr_key === 'string' && value !== undefined) {
      attr[attr_key] = value;
    } else if (attr_key !== null && typeof attr_key === 'object' && Object.getPrototypeOf(attr_key) == Object.prototype) {
      // check plain object
      attr = attr_key;
    } else {
      // something fatal occuered
      throw new Error('setAttr argument error');
    }
    for (let k in Object.keys(attr)) {
      this.attributes.setValue(k, attr[k]);
    }
  }

  protected setParent() {

  }

  protected setChildren() {

  }

  public nodeManager: NodeManager;

  /**
   * Attributes this node have.
   */
  private attributes:AttributeDictionary;

  public beforeLoad()
  {
    // this method should be overriden by the class extends this class.
  }

  public Load()
  {
    // this method should be overriden by the class extends this class.
  }

  public afterLoad()
  {
    // this method should be overriden by the class extends this class.
  }

  /**
   * components that is attached to this node.
   */
  protected behaviors:AssociativeArray<BehaviorNode[]>=new AssociativeArray<BehaviorNode[]>();

  /**
   * Add component to this node.
   */
  public addBehavior(behaviors:BehaviorNode):void {
    this.nodeManager.behaviorRunner.addBehavior(behaviors,this);
    if(!this.behaviors.has(behaviors.BehaviorName))this.behaviors.set(behaviors.BehaviorName,[]);
    this.behaviors.get(behaviors.BehaviorName).push(behaviors);
  }

  public getBehaviors(behaviorName:string):BehaviorNode[]
  {
    return this.behaviors.get(behaviorName);
  }
}
export=GomlTreeNodeBase;
