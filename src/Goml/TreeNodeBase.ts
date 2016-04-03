import JThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import isNumber from "lodash.isnumber";

/**
 * The most base class for GOML Tree
 *
 * events
 * child-added: 子が追加された時
 * child-removed: 子が削除された時
 * on-mount: 自分が有効なツリーに追加される直前。parentの参照が可能。
 * on-unmount: 自分が有効なツリーから削除される直前。parentの参照が可能。
 *
 * イベントの通知順序には注意が必要です。
 * 例として、あるNodeが子として追加された場合、子にparent-addedが呼ばれその次に自分自身にchild-addedが通知されます。
 *
 * また`this.mount`はwillではfalse, didではtrueです。
 */
class TreeNodeBase extends JThreeObjectEEWithID {
  /**
   * the parent node of this node
   */
  protected __parent: TreeNodeBase;

  /**
   * the node array of this node
   */
  protected __children: TreeNodeBase[] = [];

  /**
   * this property is true when this node is mouted to available tree.
   * @type {boolean}
   */
  private _mounted: boolean = false;

  constructor() {
    super();
    this.on("child-added", (child) => {
      const cb = this.__onChildAdded;
      if (cb) { cb.bind(this)(child); }
    });
    this.on("child-removed", (child) => {
      const cb = this.__onChildRemoved;
      if (cb) { cb.bind(this)(child); }
    });
    this.on("on-mount", () => {
      const cb = this.__onMount;
      if (cb) { cb.bind(this)(); }
    });
    this.on("on-unmount", () => {
      const cb = this.__onUnmount;
      if (cb) { cb.bind(this)(); }
    });
  }

  /**
   * Execute delegate in each nodes recursively.
   * @param {TreeNodeBase) => void} act [description]
   */
  public callRecursive(act: (node: TreeNodeBase) => void): void {
    act(this);
    this.__children.forEach((v) => {
      v.callRecursive(act);
    });
  }

  /**
   * Execute delegate in each nodes recursively with return value
   */
  public callRecursiveWithReturn<T>(act: (node: TreeNodeBase) => T): T[] {
    let ret: T[] = [];
    ret.push(act(this));
    this.__children.forEach((v) => {
      ret = ret.concat(v.callRecursiveWithReturn<T>(act));
    });
    return ret;
  }

  /**
   * get mounted status
   * @return {boolean} [description]
   */
  public get Mounted(): boolean {
    return this._mounted;
  }

  /**
   * update mounted status and emit events
   * @param {boolean} mounted [description]
   */
  public set Mounted(mounted: boolean) {
    if ((mounted && !this._mounted) || (!mounted && this._mounted)) {
      this._mounted = mounted;
      if (this._mounted) {
        this.emit("on-mount");
        this.emit("node-mount-process-finished", this._mounted); // this will be move
        this.__children.forEach((child) => {
          child.Mounted = true;
        });
      } else {
        this.emit("on-unmount");
        this.emit("node-mount-process-finished", this._mounted); // this will be move
        this.__children.forEach((child) => {
          child.Mounted = false;
        });
      }
    }
  }

  /**
   * get parent of this Node
   * @return {TreeNodeBase} [description]
   */
  public get parent(): TreeNodeBase {
    return this.__parent;
  }

  /**
   * get children of this Node.
   * @return {TreeNodeBase[]} [description]
   */
  public get children(): TreeNodeBase[] {
    return this.__children;
  }

  /**
   * get index of this node from parent.
   * @return {number} [description]
   */
  public get index(): number {
    return this.__parent.__children.indexOf(this);
  }

  /**
   * return true when this Node is Root(no parent).
   * @return {boolean} is root.
   */
  public get isRoot(): boolean {
    return !this.__parent;
  }

  /**
   * Add child to this node
   * @param {TreeNodeBase} child Target node to be inserted
   * @param {number}       index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
   */
  public addChild(child: TreeNodeBase, index?: number): void {
    child.__parent = this;
    if (!isNumber(index) && index != null) {
      throw new Error("insert index should be number or null or undefined.");
    }
    const insertIndex = index == null ? this.__children.length : index;
    this.__children.splice(insertIndex, 0, child);
    if (this.Mounted) {
      child.Mounted = true;
      this.emit("child-added", child);
    }
  }

	/**
	 * remove child of this node
	 * @param  {TreeNodeBase} child
	 */
  public removeChild(child: TreeNodeBase): void {
    for (let i = 0; i < this.__children.length; i++) {
      let v = this.__children[i];
      if (v === child) {
        child.__parent = null;
        this.__children.splice(i, 1);
        if (this.Mounted) {
          child.Mounted = false;
          this.emit("child-removed", child);
        }
        // TODO: events after-treatment
        child = null;
        break;
      }
    }
  }

  /**
   * remove myself
   */
  public remove(): void {
    if (this.__parent) {
      console.log("remove", this.__parent);
      this.__parent.removeChild(this);
    } else {
      throw new Error("root Node cannot be removed.");
    }
  }

  /**
   * This method is called when child is added
   * This method should be overridden.
   */
  protected __onChildAdded(child: TreeNodeBase): void {
    return;
  };

  /**
   * This method is called when child is removed
   * This method should be overridden.
   */
  protected __onChildRemoved(child: TreeNodeBase): void {
    return;
  };

  /**
   * This method is called when this node is mounted to available tree.
   * If you change attribute here, no events are fired.
   * This method should be overridden.
   */
  protected __onMount(): void {
    return;
  };

  /**
   * This method is called when this node is unmounted from available tree.
   * You can still access parent.
   * This method should be overridden.
   */
  protected __onUnmount(): void {
    return;
  };
}

export default TreeNodeBase;
