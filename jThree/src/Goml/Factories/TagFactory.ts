import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import jThreeObject = require("../../Base/JThreeObject");
import JThreeContext = require("../../NJThreeContext");
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

    public CreateNodeForThis(elem: HTMLElement, parent: GomlTreeNodeBase): GomlTreeNodeBase {
        return new this.nodeType(elem,parent);
    }

    protected getTag(name:string): TagFactory {
        return this.nodeManager.configurator.getGomlTagFactory(name);
    }
}

export=TagFactory;
