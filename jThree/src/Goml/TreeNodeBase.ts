import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import Delegates = require("../Base/Delegates");
import GomlNodeEventList = require("./GomlNodeEventList");

/**
 * The most base class for GOML Tree
 *
 * events
 * child-added: 子が追加された時
 * parent-added: 親が追加された時
 * child-removed: 子が削除された時
 * parent-removed: 親が削除された時
 * node-mounted: 自分が有効なツリーに追加された時
 * node-unmouted: 自分が有効なツリーから削除された時
 *
 * イベントの通知順序には注意が必要です。
 * 例として、あるNodeが子として追加された場合、child-addedが呼ばれその次に子にparent-addedが通知されます。
 */
class TreeNodeBase extends JThreeObjectEEWithID {
  constructor() {
    super();
    this.on('parent-added', (argu) => {
      const cb = this.onParentAdded;
      if (cb) { cb(argu) }
    });
    this.on('parent-removed', (argu) => {
      const cb = this.onParentRemoved;
      if (cb) { cb(argu) }
    });
    this.on('child-added', (argu) => {
      const cb = this.onChildAdded;
      if (cb) { cb(argu) }
    });
    this.on('child-removed', (argu) => {
      const cb = this.onChildRemoved;
      if (cb) { cb(argu) }
    });
    this.on('node-mounted', () => {
      const cb = this.onNodeMouted;
      if (cb) { cb() }
    });
    this.on('node-unmouted', () => {
      const cb = this.onNodeUnmouted;
      if (cb) { cb() }
    });
  }

  /**
   * this property is true when this node is mouted to available tree.
   * @type {boolean}
   */
  private mounted: boolean;

  /**
   * get mounted status
   * @return {boolean} [description]
   */
  public get Mounted(): boolean {
    return this.mounted;
  }

  /**
   * update mounted status and emit events
   * @param {boolean} mounted [description]
   */
  public set Mounted(mounted: boolean) {
    if (mounted && !this.mounted) {
      this.mounted = mounted;
       if (this.mounted) {
         this.emit('node-mounted');
       } else {
         this.emit('node-unmounted');
       }
    }
  }

	/**
	 * the parent node of this node
	 */
  protected parent: TreeNodeBase;

	/**
	 * the node array of this node
	 */
  protected children: TreeNodeBase[] = [];

	/**
	 * Add child to this node
	 */
  public addChild(child: TreeNodeBase): void {
    child.parent = this;
    this.children.push(child);
    if (this.Mounted) {
      this.emit('child-added', child);
      child.emit('parent-added', this);
      if (!child.Mounted) {
        child.Mounted = true;
      }
    }
  }

	/**
	 * remove child of this node
	 * @param  {TreeNodeBase} child
	 */
  public removeChild(child: TreeNodeBase): void {
    for (let i = 0; i < this.children.length; i++) {
      let v = this.children[i]
      if (v.ID == child.ID) {
        this.children.splice(i, 1);
        // TODO: events after-treatment
        if (this.Mounted) {
          this.emit('child-removed', child);
          child.emit('parent-removed', this);
          child.Mounted = false;
        }
        child = null;
        break;
      }
    }
  }

  /**
   * remove myself
   */
  public remove(): void {
    this.parent.removeChild(this);
  }

  /**
   * This method is called when parent is added
   * This method should be overwrited
   */
  protected onParentAdded(attr: TreeNodeBase): void {}

  /**
   * This method is called when parent is removed
   * This method should be overwrited
   */
  protected onParentRemoved(attr: TreeNodeBase): void {}

  /**
   * This method is called when child is added
   * This method should be overwrited
   */
  protected onChildAdded(attr: TreeNodeBase): void {}

  /**
   * This method is called when child is removed
   * This method should be overwrited
   */
  protected onChildRemoved(attr: TreeNodeBase): void {}

  /**
   * This method is called when this node is mouted to available tree.
   * This method should be overwrited
   */
  protected onNodeMouted(): void {}

  /**
   * This method is called when this node is unmounted from available tree.
   * This method should be overwrited
   */
  protected onNodeUnmouted(): void {}

	/**
	 * Execute delegate in each nodes recursively.
	 */
  public callRecursive(act: Delegates.Action1<TreeNodeBase>) {
    act(this);
    this.children.forEach(v=> v.callRecursive(act));
  }

  public update() {

  }
}

export = TreeNodeBase;
