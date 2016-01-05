import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import Delegates = require("../Base/Delegates");
import GomlNodeEventList = require("./GomlNodeEventList");

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
  constructor() {
    super();
    this.on('child-added', (child) => {
      const cb = this.onChildAdded;
      if (cb) { cb.bind(this)(child) }
    });
    this.on('child-removed', (child) => {
      const cb = this.onChildRemoved;
      if (cb) { cb.bind(this)(child) }
    });
    this.on('on-mount', () => {
      const cb = this.onMount;
      if (cb) { cb.bind(this)() }
    });
    this.on('on-unmount', () => {
      const cb = this.onUnmount;
      if (cb) { cb.bind(this)() }
    });
  }

  /**
   * this property is true when this node is mouted to available tree.
   * @type {boolean}
   */
  private mounted: boolean = false;

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
        this.emit('on-mount');
        this.emit('node-mount-process-finished', this.mounted); // this will be move
        this.children.forEach((child) => {
          child.Mounted = true;
        });
      } else {
        this.emit('on-unmount');
        this.emit('node-mount-process-finished', this.mounted); // this will be move
        this.children.forEach((child) => {
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
        child.parent = null;
        this.children.splice(i, 1);
        if (this.Mounted) {
          child.Mounted = false;
          this.emit('child-removed', child);
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
    this.parent.removeChild(this);
  }

  /**
   * This method is called when child is added
   * This method should be overridden.
   */
  protected onChildAdded(child: TreeNodeBase): void {}

  /**
   * This method is called when child is removed
   * This method should be overridden.
   */
  protected onChildRemoved(child: TreeNodeBase): void {}

  /**
   * This method is called when this node is mounted to available tree.
   * If you change attribute here, no events are fired.
   * This method should be overridden.
   */
  protected onMount(): void {}

  /**
   * This method is called when this node is unmounted from available tree.
   * You can still access parent.
   * This method should be overridden.
   */
  protected onUnmount(): void {}

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
