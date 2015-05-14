import JThreeObject=require('Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeMeshNode = require("../Nodes/GomlTreeMeshNode");
import GomlTreeSceneNode = require("../Nodes/GomlTreeSceneNode");
import GomlTreeSceneObjectNodeBase = require("../Nodes/GomlTreeSceneObjectNodeBase");
import GomlSceneObjectTagBase = require("./GomlSceneObjectTagBase");
class GomlMeshTag extends GomlSceneObjectTagBase
{
  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:GomlTreeSceneNode,parentSceneObjectNode:GomlTreeSceneObjectNodeBase):GomlTreeSceneObjectNodeBase
  {
    return new GomlTreeMeshNode(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

  get TagName(): string { return "MESH"; }
}

export=GomlMeshTag;
