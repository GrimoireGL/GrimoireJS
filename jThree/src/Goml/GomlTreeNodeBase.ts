import AttributeDictionary = require("./AttributeDictionary");
import TreeNodeBase = require("./TreeNodeBase");
import JThreeContext = require("../JThreeContext");
import NodeManager = require("./NodeManager");
import ContextComponents = require("../ContextComponents");
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import Delegates = require("../Base/Delegates");
import NodeProps = require("./NodeProps");

/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends TreeNodeBase {
  /**
   * Attributes this node have.
   */
  public attributes: AttributeDictionary;

  /**
   * node manager
   * @type {NodeManager}
   */
  public nodeManager: NodeManager;

  /**
   * props for Node.
   * @type {NodeProps}
   */
  public props: NodeProps = new NodeProps();

  /**
   * Group is named after groupPrefixes that supplied from parents.
   * If this property is not overridden, no prefix will be added.
   * @type {string}
   */
  protected groupPrefix: string = "";

  /**
   * components that is attached to this node.
   */
  protected behaviors: {[key: string]: BehaviorNode[]} = {};

  /**
   * コンストラクタ内ではattributeの定義、attributeの変化時のイベント、child, parentが更新された際のイベントを設定します。
   */
  constructor() {
    super();

    // load node manager
    this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

    // after configuration, this node is going to add to NodesById
    this.nodeManager.NodesById[this.ID] =  this;
    this.attributes = new AttributeDictionary(this);

    // apply attributes
    this.on("node-mount-process-finished", (mounted) => {
      const attrs = this.attributes.getAllAttributes();
      const attrs_kv = {};
      Object.keys(attrs).forEach((v) => {
        attrs_kv[v] = attrs[v].Value;
      });
      // console.log("ga initialize", this.getTypeName(), attrs_kv);
      if (mounted) {
        this.attributes.forEachAttr((ga) => {
          ga.initialize();
        });
      }
    });
  }

  /**
   * get group prefixes array that is concatenated from ansestors of tree.
   * @return {string[]} array of group prefix
   */
  public get GroupPrefix(): string[] {
    let groupPrefixArray: string[] = [];
    if (this.parent) {
      groupPrefixArray = (<GomlTreeNodeBase>this.parent).GroupPrefix;
    }
    if (this.groupPrefix !== "") {
      groupPrefixArray.push(this.groupPrefix);
    }
    return groupPrefixArray;
  }

  /**
   * Add node to expose for requiring from other node.
   * @param {string} name String to require argument. This must be uniqe.
   */
  public nodeExport(name: string): void {
    const group = [].concat(["jthree"], this.GroupPrefix).join(".");
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
  public nodeImport(group: string, name: string, callbackfn: Delegates.Action1<GomlTreeNodeBase>): void {
    this.nodeManager.nodeRegister.getNode(group, name, callbackfn);
  }

  /**
   * Add component to this node.
   */
  public addBehavior(behaviors: BehaviorNode): void {
    this.nodeManager.behaviorRunner.addBehavior(behaviors, this);
    if (!this.behaviors[behaviors.BehaviorName]) {
      this.behaviors[behaviors.BehaviorName] = [];
    }
    this.behaviors[behaviors.BehaviorName].push(behaviors);
  }

  public getBehaviors(behaviorName: string): BehaviorNode[] {
    return this.behaviors[behaviorName];
  }
}

export = GomlTreeNodeBase;
