import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeVpNode = require("../Nodes/GomlTreeVpNode");
class GomlVpTag extends GomlTagBase {
   CreateNodeForThis(elem: Element): GomlTreeNodeBase
   {
       return new GomlTreeVpNode(elem);
   }

   get TagName(): string { return "VP"; }
}

export=GomlVpTag;
