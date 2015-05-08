import JThreeObject=require('Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeCameraNode = require("../Nodes/GomlTreeCameraNode");
import GomlTreeSceneNode = require("../Nodes/GomlTreeSceneNode");
import GomlTreeSceneObjectNodeBase = require("../Nodes/GomlTreeSceneObjectNodeBase");
import GomlSceneObjectTagBase = require("./GomlSceneObjectTagBase");
class GomlCameraTag extends GomlSceneObjectTagBase
{
  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:GomlTreeSceneNode,parentSceneObjectNode:GomlTreeSceneObjectNodeBase):GomlTreeSceneObjectNodeBase
  {
    return new GomlTreeCameraNode(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

  get TagName(): string { return "CAMERA"; }
}

export=GomlCameraTag;
