import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import jThreeObject = require("../../Base/JThreeObject");
import JThreeContext = require("../../JThreeContext");
import NodeManager = require('./../NodeManager');
import ContextComponents = require('../../ContextComponents');

/**
 * HTMLElementからGomlNodeを生成します
 */
class TagFactory extends jThreeObject { // rename candidate: NodeFactory
    /**
     * HTMLElementからGomlNodeを生成します
     * @param {HTMLElement} elem 生成元のHTMLElement
     */
    constructor(elem: HTMLElement)
    {
      super();
      this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager)
      this.tagName = elem.tagName;
      this.nodeType = this.nodeManager.configurator.getGomlNode(this.tagName);
    }

    /**
     * nodeManager
     * @type {NodeManager}
     */
    private nodeManager: NodeManager;

    /**
     * タグ名
     * @type {string}
     */
    protected tagName:string;

    /**
     * GomlNodeのコンストラクタ
     * @type {any}
     */
    protected nodeType:any;

    public get TagName(): string {
        return this.tagName;
    }

    public get NoNeedParseChildren():boolean
    {
        return false;
    }

    /**
     * Nodeを生成します
     *
     * `nodeType`に指定されたNodeの種類より、対応するNodeを生成して返します。
     * `nodeType`は`TagFactory`を継承するクラスで指定されます。
     * @param  {GomlTreeNodeBase} parent 親のNode
     * @return {GomlTreeNodeBase}
     */
    public CreateNode(): GomlTreeNodeBase {
        return new this.nodeType();
    }
}

export=TagFactory;
