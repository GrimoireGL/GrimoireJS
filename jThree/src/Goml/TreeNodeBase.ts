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
 *
 * イベントの通知順序には注意が必要です。
 * 例として、あるNodeが子として追加された場合、child-addedが呼ばれその次に子にparent-addedが通知されます。
 */
class TreeNodeBase extends JThreeObjectEEWithID {
  constructor() {
    super();
  }

  /**
   * falseの時はchild, parentが更新された際のeventは呼ばれません。
   * @type {boolean}
   */
  public initialized: boolean = false;

  /**
   * child, parentの初期化がされていることを示すinitializedのフラグを建て、child, parentが更新された際のeventが有効になるようにします。
   *
   * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でaddChildが呼ばれてもeventは発生しません。
   */
  public initialize(): void {
    this.initialized = true;
    if (this.children.length !== 0) {
      // thread blocking process
      this.children.forEach((child) => {
        this.emit('child-added', child);
        child.emit('parent-added', parent);
      }, this);
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
    if (this.initialized) {
      process.nextTick(() => {
        this.emit('child-added', child);
        child.emit('parent-added', this);
      });
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
        if (this.initialized) {
          process.nextTick(() => {
            this.emit('child-removed', child);
            child.emit('parent-removed', this);
          });
        }
        break;
      }
    }
  }

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
