import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");

class GomlRootTag extends GomlTagBase {
    CreateNodeForThis(elem: Element): GomlTreeNodeBase { throw new Error("Not implemented"); }

    get TagName(): string { return "GOML"; }
}

export=GomlRootTag;
