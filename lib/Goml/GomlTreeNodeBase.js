import AttributeDictionary from "./AttributeDictionary";
import TreeNodeBase from "./TreeNodeBase";
import JThreeContext from "../JThreeContext";
import ContextComponents from "../ContextComponents";
import NodeProps from "./NodeProps";
/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends TreeNodeBase {
    /**
     * コンストラクタ内ではattributeの定義、attributeの変化時のイベント、child, parentが更新された際のイベントを設定します。
     */
    constructor() {
        super();
        /**
         * props for Node.
         * @type {NodeProps}
         */
        this.props = new NodeProps();
        /**
         * Group is named after groupPrefixes that supplied from parents.
         * If this property is not overridden, no prefix will be added.
         * @type {string}
         */
        this.__groupPrefix = "";
        /**
         * components that is attached to this node.
         */
        this.__behaviors = {};
        // load node manager
        this.nodeManager = JThreeContext.getContextComponent(ContextComponents.NodeManager);
        // after configuration, this node is going to add to NodesById
        this.nodeManager.nodesById[this.ID] = this;
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
    get GroupPrefix() {
        let groupPrefixArray = [];
        if (this.__parent) {
            groupPrefixArray = this.__parent.GroupPrefix;
        }
        if (this.__groupPrefix !== "") {
            groupPrefixArray.push(this.__groupPrefix);
        }
        return groupPrefixArray;
    }
    /**
     * Add node to expose for requiring from other node.
     * @param {string} name String to require argument. This must be uniqe.
     */
    nodeExport(name) {
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
     * @param {(node: GomlTreeNodeBase) => void} callbackfn callback function called with required node.
     */
    nodeImport(group, name, callbackfn) {
        this.nodeManager.nodeRegister.getNode(group, name, callbackfn);
    }
    /**
     * Add component to this node.
     */
    addBehavior(behaviors) {
        this.nodeManager.behaviorRunner.addBehavior(behaviors, this);
        if (!this.__behaviors[behaviors.BehaviorName]) {
            this.__behaviors[behaviors.BehaviorName] = [];
        }
        this.__behaviors[behaviors.BehaviorName].push(behaviors);
    }
    getBehaviors(behaviorName) {
        return this.__behaviors[behaviorName];
    }
    update() {
        return;
    }
}
export default GomlTreeNodeBase;
