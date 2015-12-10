import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import Delegates = require("../Base/Delegates");
import GomlNodeEventList = require("./GomlNodeEventList");

/**
 * The most base class for GOML Tree
 *
 * events
 * child-added: 子が追加された時
 * child-removed: 子が削除された時
 * node-will-mount: 自分が有効なツリーに追加される直前。parentの参照が可能。
 * node-will-unmout: 自分が有効なツリーから削除される直前。parentの参照が可能。
 * node-did-mounted: 自分が有効なツリーに追加された時
 * node-did-unmouted: 自分が有効なツリーから削除された時
 *
 * イベントの通知順序には注意が必要です。
 * 例として、あるNodeが子として追加された場合、子にparent-addedが呼ばれその次に自分自身にchild-addedが通知されます。
 *
 * また`this.mount`はwillではfalse, didではtrueです。
 */
class TreeNodeBase extends JThreeObjectEEWithID {
  constructor() {
    super();
    this.on('child-added', (argu) => {
      const cb = this.onChildAdded;
      if (cb) { cb(argu) }
    });
    this.on('child-removed', (argu) => {
      const cb = this.onChildRemoved;
      if (cb) { cb(argu) }
    });
    this.on('node-will-mount', (parent) => {
      const cb = this.nodeWillMount;
      if (cb) { cb(parent) }
    });
    this.on('node-will-unmout', (parent) => {
      const cb = this.nodeWillUnmount;
      if (cb) { cb(parent) }
    });
    this.on('node-did-mounted', () => {
      const cb = this.nodeDidMounted;
      if (cb) { cb() }
    });
    this.on('node-did-unmouted', () => {
      const cb = this.nodeDidUnmounted;
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
      // do not use this event.
      this.emit('just-before-node-mounted-update', mounted);
      this.mounted = mounted;
      if (this.mounted) {
        this.emit('node-did-mounted');
        this.children.forEach((child) => {
          child.emit('node-will-mount');
          child.Mounted = true;
        });
      } else {
        this.emit('node-unmounted');
        this.children.forEach((child) => {
          child.emit('node-will-mount');
          child.Mounted = false;
        });
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
      child.emit('node-will-mount', this);
      child.Mounted = true;
      this.emit('child-added', child);
    }
  }

	/**
	 * remove child of this node
	 * @param  {TreeNodeBase} child
	 */
  public removeChild(child: TreeNodeBase): void {
    for (let i = 0; i < this.children.length; i++) {
      let v = this.children[i]
      if (v === child) {
        if (this.Mounted) {
          child.emit('node-will-unmount', this);
        }
        this.children.splice(i, 1);
        child.parent = null;
        // TODO: events after-treatment
        if (this.Mounted) {
          this.emit('child-removed', child);
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
   * This method is called when child is added
   * This method should be overridden.
   */
  protected onChildAdded(attr: TreeNodeBase): void {}

  /**
   * This method is called when child is removed
   * This method should be overridden.
   */
  protected onChildRemoved(attr: TreeNodeBase): void {}

  /**
   * This method is called when this node is mounted to available tree.
   * If you change attribute here, no events are fired.
   * This method should be overridden.
   */
  protected nodeWillMount(parent: TreeNodeBase): void {}

  /**
   * This method is called when this node is unmounted from available tree.
   * You can still access parent.
   * This method should be overridden.
   */
  protected nodeWillUnmount(parent: TreeNodeBase): void {}

  /**
   * This method is called when this node is mounted to available tree.
   * This method should be overridden.
   */
  protected nodeDidMounted(): void {}

  /**
   * This method is called when this node is unmounted from available tree.
   * This method should be overridden.
   */
  protected nodeDidUnmounted(): void {}

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
