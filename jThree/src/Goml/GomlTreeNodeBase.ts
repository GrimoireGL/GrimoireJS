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
   * Group is named after groupPrefixes that supplied from parents.
   * If this property is not overridden, no prefix will be added.
   * @type {string}
   */
  protected groupPrefix: string = ''

  /**
   * get group prefixes array that is concatenated from ansestors of tree.
   * @return {string[]} array of group prefix
   */
  public get GroupPrefix(): string[] {
    let groupPrefixArray: string[] = []
    if (this.parent && (<GomlTreeNodeBase>this.parent).groupPrefix !== '') {
      groupPrefixArray.push((<GomlTreeNodeBase>this.parent).groupPrefix)
    }
    if (this.groupPrefix !== '') {
      groupPrefixArray.push(this.groupPrefix);
    }
    return groupPrefixArray;
  }

  /**
   * Add node to expose for requiring from other node.
   * @param {string} name String to require argument. This must be uniqe.
   */
  nodeExport(name: string): void {
    const group = [].concat(['jthree'], this.GroupPrefix).join('.');
    this.nodeManager.nodeRegister.addNode(group, name, this);
  }

  /**
   * Require other node. callbackfn is called when the momoent when this method is called or, soecified node is added, updated or removed.
   * If specified node has not added yet, callbackfn is called with null.
   * If specified node is removed, callbackfn is called with null.
   *
   * @param {string}                              group      group string that group prefixes array joined with '.'.
   * @param {string}                              name       name identify among specified group.
   * @param {Delegates.Action1<GomlTreeNodeBase>} callbackfn callback function called with required node.
   */
  nodeImport(group: string, name: string, callbackfn: Delegates.Action1<GomlTreeNodeBase>): void {
    this.nodeManager.nodeRegister.getNode(group, name, callbackfn);
  }

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
