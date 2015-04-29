import JThreeObject=require('Base/JThreeObject');
import GomlTagBase = require("../GomlTagBase");
import GomlLoader = require("../GomlLoader");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeSceneNode = require("../Nodes/GomlTreeSceneNode");
class GomlSceneTag extends GomlTagBase
{
  get TagName():string
  {
    return "SCENE";
  }

  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
      return new GomlTreeSceneNode(elem,loader,parent);
  }
}

export=GomlSceneTag;
