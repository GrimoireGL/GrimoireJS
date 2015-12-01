import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import jThreeObject = require("../../Base/JThreeObject");
import JThreeContext = require("../../JThreeContext");
import NodeManager = require('./../NodeManager');
import ContextComponents = require('../../ContextComponents');

class TagFactory extends jThreeObject {
    constructor(tagName:string,nodeType:any)
    {
      super();
      this.tagName=tagName;
      this.nodeType=nodeType;
      this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager)
    }

    private nodeManager: NodeManager;

    protected tagName:string;

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
    public CreateNodeForThis(parent: GomlTreeNodeBase): GomlTreeNodeBase {
        return new this.nodeType(parent);
    }

    protected getTag(name:string): TagFactory {
        return this.nodeManager.configurator.getGomlTagFactory(name);
    }
}

export=TagFactory;
