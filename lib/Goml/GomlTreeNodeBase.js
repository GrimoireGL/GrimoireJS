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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvR29tbFRyZWVOb2RlQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxtQkFBbUIsTUFBTSx1QkFBdUI7T0FDaEQsWUFBWSxNQUFNLGdCQUFnQjtPQUNsQyxhQUFhLE1BQU0sa0JBQWtCO09BRXJDLGlCQUFpQixNQUFNLHNCQUFzQjtPQUU3QyxTQUFTLE1BQU0sYUFBYTtBQUVuQzs7R0FFRztBQUNILCtCQUErQixZQUFZO0lBOEJ6Qzs7T0FFRztJQUNIO1FBQ0UsT0FBTyxDQUFDO1FBdEJWOzs7V0FHRztRQUNJLFVBQUssR0FBYyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBRTFDOzs7O1dBSUc7UUFDTyxrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUVyQzs7V0FFRztRQUNPLGdCQUFXLEdBQW9DLEVBQUUsQ0FBQztRQVExRCxvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakcsOERBQThEO1FBQzlELElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBSSxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLENBQUMsT0FBTztZQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDakQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7WUFDSCw4REFBOEQ7WUFDOUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxXQUFXO1FBQ3BCLElBQUksZ0JBQWdCLEdBQWEsRUFBRSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLGdCQUFnQixHQUFzQixJQUFJLENBQUMsUUFBUyxDQUFDLFdBQVcsQ0FBQztRQUNuRSxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksVUFBVSxDQUFDLElBQVk7UUFDNUIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksVUFBVSxDQUFDLEtBQWEsRUFBRSxJQUFZLEVBQUUsVUFBNEM7UUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksV0FBVyxDQUFDLFNBQXVCO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLFlBQVksQ0FBQyxZQUFvQjtRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sTUFBTTtRQUNYLE1BQU0sQ0FBQztJQUNULENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJHb21sL0dvbWxUcmVlTm9kZUJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXR0cmlidXRlRGljdGlvbmFyeSBmcm9tIFwiLi9BdHRyaWJ1dGVEaWN0aW9uYXJ5XCI7XG5pbXBvcnQgVHJlZU5vZGVCYXNlIGZyb20gXCIuL1RyZWVOb2RlQmFzZVwiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBOb2RlTWFuYWdlciBmcm9tIFwiLi9Ob2RlTWFuYWdlclwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IEJlaGF2aW9yTm9kZSBmcm9tIFwiLi9Ob2Rlcy9CZWhhdmlvcnMvQmVoYXZpb3JOb2RlXCI7XG5pbXBvcnQgTm9kZVByb3BzIGZyb20gXCIuL05vZGVQcm9wc1wiO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIG1vc3QgYmFzZSBjbGFzcyBpbiBhbGwgR29tbE5vZGVcbiAqL1xuY2xhc3MgR29tbFRyZWVOb2RlQmFzZSBleHRlbmRzIFRyZWVOb2RlQmFzZSB7XG4gIC8qKlxuICAgKiBBdHRyaWJ1dGVzIHRoaXMgbm9kZSBoYXZlLlxuICAgKi9cbiAgcHVibGljIGF0dHJpYnV0ZXM6IEF0dHJpYnV0ZURpY3Rpb25hcnk7XG5cbiAgLyoqXG4gICAqIG5vZGUgbWFuYWdlclxuICAgKiBAdHlwZSB7Tm9kZU1hbmFnZXJ9XG4gICAqL1xuICBwdWJsaWMgbm9kZU1hbmFnZXI6IE5vZGVNYW5hZ2VyO1xuXG4gIC8qKlxuICAgKiBwcm9wcyBmb3IgTm9kZS5cbiAgICogQHR5cGUge05vZGVQcm9wc31cbiAgICovXG4gIHB1YmxpYyBwcm9wczogTm9kZVByb3BzID0gbmV3IE5vZGVQcm9wcygpO1xuXG4gIC8qKlxuICAgKiBHcm91cCBpcyBuYW1lZCBhZnRlciBncm91cFByZWZpeGVzIHRoYXQgc3VwcGxpZWQgZnJvbSBwYXJlbnRzLlxuICAgKiBJZiB0aGlzIHByb3BlcnR5IGlzIG5vdCBvdmVycmlkZGVuLCBubyBwcmVmaXggd2lsbCBiZSBhZGRlZC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHByb3RlY3RlZCBfX2dyb3VwUHJlZml4OiBzdHJpbmcgPSBcIlwiO1xuXG4gIC8qKlxuICAgKiBjb21wb25lbnRzIHRoYXQgaXMgYXR0YWNoZWQgdG8gdGhpcyBub2RlLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9fYmVoYXZpb3JzOiB7W2tleTogc3RyaW5nXTogQmVoYXZpb3JOb2RlW119ID0ge307XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv+WGheOBp+OBr2F0dHJpYnV0ZeOBruWumue+qeOAgWF0dHJpYnV0ZeOBruWkieWMluaZguOBruOCpOODmeODs+ODiOOAgWNoaWxkLCBwYXJlbnTjgYzmm7TmlrDjgZXjgozjgZ/pmpvjga7jgqTjg5njg7Pjg4jjgpLoqK3lrprjgZfjgb7jgZnjgIJcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBsb2FkIG5vZGUgbWFuYWdlclxuICAgIHRoaXMubm9kZU1hbmFnZXIgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8Tm9kZU1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLk5vZGVNYW5hZ2VyKTtcblxuICAgIC8vIGFmdGVyIGNvbmZpZ3VyYXRpb24sIHRoaXMgbm9kZSBpcyBnb2luZyB0byBhZGQgdG8gTm9kZXNCeUlkXG4gICAgdGhpcy5ub2RlTWFuYWdlci5ub2Rlc0J5SWRbdGhpcy5JRF0gPSAgdGhpcztcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBuZXcgQXR0cmlidXRlRGljdGlvbmFyeSh0aGlzKTtcblxuICAgIC8vIGFwcGx5IGF0dHJpYnV0ZXNcbiAgICB0aGlzLm9uKFwibm9kZS1tb3VudC1wcm9jZXNzLWZpbmlzaGVkXCIsIChtb3VudGVkKSA9PiB7XG4gICAgICBjb25zdCBhdHRycyA9IHRoaXMuYXR0cmlidXRlcy5nZXRBbGxBdHRyaWJ1dGVzKCk7XG4gICAgICBjb25zdCBhdHRyc19rdiA9IHt9O1xuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgYXR0cnNfa3Zbdl0gPSBhdHRyc1t2XS5WYWx1ZTtcbiAgICAgIH0pO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJnYSBpbml0aWFsaXplXCIsIHRoaXMuZ2V0VHlwZU5hbWUoKSwgYXR0cnNfa3YpO1xuICAgICAgaWYgKG1vdW50ZWQpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2hBdHRyKChnYSkgPT4ge1xuICAgICAgICAgIGdhLmluaXRpYWxpemUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IGdyb3VwIHByZWZpeGVzIGFycmF5IHRoYXQgaXMgY29uY2F0ZW5hdGVkIGZyb20gYW5zZXN0b3JzIG9mIHRyZWUuXG4gICAqIEByZXR1cm4ge3N0cmluZ1tdfSBhcnJheSBvZiBncm91cCBwcmVmaXhcbiAgICovXG4gIHB1YmxpYyBnZXQgR3JvdXBQcmVmaXgoKTogc3RyaW5nW10ge1xuICAgIGxldCBncm91cFByZWZpeEFycmF5OiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLl9fcGFyZW50KSB7XG4gICAgICBncm91cFByZWZpeEFycmF5ID0gKDxHb21sVHJlZU5vZGVCYXNlPnRoaXMuX19wYXJlbnQpLkdyb3VwUHJlZml4O1xuICAgIH1cbiAgICBpZiAodGhpcy5fX2dyb3VwUHJlZml4ICE9PSBcIlwiKSB7XG4gICAgICBncm91cFByZWZpeEFycmF5LnB1c2godGhpcy5fX2dyb3VwUHJlZml4KTtcbiAgICB9XG4gICAgcmV0dXJuIGdyb3VwUHJlZml4QXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5vZGUgdG8gZXhwb3NlIGZvciByZXF1aXJpbmcgZnJvbSBvdGhlciBub2RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBTdHJpbmcgdG8gcmVxdWlyZSBhcmd1bWVudC4gVGhpcyBtdXN0IGJlIHVuaXFlLlxuICAgKi9cbiAgcHVibGljIG5vZGVFeHBvcnQobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXAgPSBbXS5jb25jYXQoW1wianRocmVlXCJdLCB0aGlzLkdyb3VwUHJlZml4KS5qb2luKFwiLlwiKTtcbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm5vZGVSZWdpc3Rlci5hZGROb2RlKGdyb3VwLCBuYW1lLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1aXJlIG90aGVyIG5vZGUuIGNhbGxiYWNrZm4gaXMgY2FsbGVkIHdoZW4gdGhlIG1vbW9lbnQgd2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb3IsIHNvZWNpZmllZCBub2RlIGlzIGFkZGVkLCB1cGRhdGVkIG9yIHJlbW92ZWQuXG4gICAqIElmIHNwZWNpZmllZCBub2RlIGhhcyBub3QgYWRkZWQgeWV0LCBjYWxsYmFja2ZuIGlzIGNhbGxlZCB3aXRoIG51bGwuXG4gICAqIElmIHNwZWNpZmllZCBub2RlIGlzIHJlbW92ZWQsIGNhbGxiYWNrZm4gaXMgY2FsbGVkIHdpdGggbnVsbC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgICAgICBncm91cCBzdHJpbmcgdGhhdCBncm91cCBwcmVmaXhlcyBhcnJheSBqb2luZWQgd2l0aCAnLicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgbmFtZSBpZGVudGlmeSBhbW9uZyBzcGVjaWZpZWQgZ3JvdXAuXG4gICAqIEBwYXJhbSB7KG5vZGU6IEdvbWxUcmVlTm9kZUJhc2UpID0+IHZvaWR9IGNhbGxiYWNrZm4gY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdpdGggcmVxdWlyZWQgbm9kZS5cbiAgICovXG4gIHB1YmxpYyBub2RlSW1wb3J0KGdyb3VwOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgY2FsbGJhY2tmbjogKG5vZGU6IEdvbWxUcmVlTm9kZUJhc2UpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm5vZGVNYW5hZ2VyLm5vZGVSZWdpc3Rlci5nZXROb2RlKGdyb3VwLCBuYW1lLCBjYWxsYmFja2ZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY29tcG9uZW50IHRvIHRoaXMgbm9kZS5cbiAgICovXG4gIHB1YmxpYyBhZGRCZWhhdmlvcihiZWhhdmlvcnM6IEJlaGF2aW9yTm9kZSk6IHZvaWQge1xuICAgIHRoaXMubm9kZU1hbmFnZXIuYmVoYXZpb3JSdW5uZXIuYWRkQmVoYXZpb3IoYmVoYXZpb3JzLCB0aGlzKTtcbiAgICBpZiAoIXRoaXMuX19iZWhhdmlvcnNbYmVoYXZpb3JzLkJlaGF2aW9yTmFtZV0pIHtcbiAgICAgIHRoaXMuX19iZWhhdmlvcnNbYmVoYXZpb3JzLkJlaGF2aW9yTmFtZV0gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fX2JlaGF2aW9yc1tiZWhhdmlvcnMuQmVoYXZpb3JOYW1lXS5wdXNoKGJlaGF2aW9ycyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0QmVoYXZpb3JzKGJlaGF2aW9yTmFtZTogc3RyaW5nKTogQmVoYXZpb3JOb2RlW10ge1xuICAgIHJldHVybiB0aGlzLl9fYmVoYXZpb3JzW2JlaGF2aW9yTmFtZV07XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHb21sVHJlZU5vZGVCYXNlO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
