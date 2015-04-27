import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeRdrNode = require("../Nodes/GomlTreeRdrNode");
import GomlLoader = require("../GomlLoader");

class GomlRdrTag extends GomlTagBase {
    CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
        return new GomlTreeRdrNode(elem,loader,parent);
    }

    get TagName(): string { return "RDR"; }
}

export=GomlRdrTag;
