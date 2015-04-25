import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
class GomlBodyTag extends GomlTagBase
{
    CreateNodeForThis(elem: Element): GomlTreeNodeBase { throw new Error("Not implemented"); }

    get TagName(): string { return "BODY"; }

}

export=GomlBodyTag;
