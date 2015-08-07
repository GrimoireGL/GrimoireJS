import GomlLoader = require("../GomlLoader");
import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import SceneNode = require("../Nodes/SceneNode");
import SceneObjectNodeBase = require("../Nodes/SceneObjects/SceneObjectNodeBase"); /**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class SceneObjectTagFactory extends TagFactory
{
    public CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    var sceneNode:SceneNode=null;
    var sceneObjectNode:SceneObjectNodeBase=null;
    if(parent.getTypeName()=="SceneNode")//This parent node is scene node. TODO: I wonder there is better way
    {
      sceneNode=<SceneNode>parent;
      sceneObjectNode=null;
    }else{
      if(typeof parent["ContainedSceneNode"]==="undefined")
      {//check parent extends SceneObjectNodeBase or not.
        console.error(`${parent.toString()} is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return null;
      }else
      {
        sceneObjectNode=<SceneObjectNodeBase>parent;
        sceneNode=sceneObjectNode.ContainedSceneNode;
      }
    }
    return this.CreateSceneObjectNodeForThis(elem,loader,parent,sceneNode,sceneObjectNode);
  }

    public CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:SceneNode,parentSceneObjectNode:SceneObjectNodeBase):SceneObjectNodeBase
  {
    return new this.nodeType(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

}

export=SceneObjectTagFactory;
