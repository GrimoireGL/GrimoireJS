import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeRdrNode = require("../Nodes/GomlTreeRdrNode");
import GomlLoader = require("../GomlLoader");
import GomlTreeTriNode = require("../Nodes/GomlTreeTriNode");

class GomlTriTag extends GomlTagBase {
    CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
        return new GomlTreeTriNode(elem, loader, parent);
    }

    get TagName(): string { return "TRI"; }
}

export=GomlTriTag;
