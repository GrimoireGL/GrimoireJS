import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeVpNode = require("../Nodes/GomlTreeVpNode");
import GomlLoader = require("../GomlLoader");
class GomlVpTag extends GomlTagBase {
   CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase
   {
       return new GomlTreeVpNode(elem,loader,parent);
   }

   get TagName(): string { return "VP"; }
}

export=GomlVpTag;
