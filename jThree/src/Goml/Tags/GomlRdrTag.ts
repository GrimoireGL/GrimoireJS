import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeRdrNode = require("../Nodes/GomlTreeRdrNode");

class GomlRdrTag extends GomlTagBase {
    CreateNodeForThis(elem: Element): GomlTreeNodeBase {
        return new GomlTreeRdrNode(elem);
    }

    get TagName(): string { return "RDR"; }
}

export=GomlRdrTag;
