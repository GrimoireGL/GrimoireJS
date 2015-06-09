import JThreeObject=require('../../Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeSceneNode = require("../Nodes/SceneNode");
import SceneObjectNodeBase = require("../Nodes/SceneObjects/SceneObjectNodeBase");
import Exceptions = require("../../Exceptions");
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class TemplateTagFactory extends TagFactory
{
  public get NoNeedParseChildren()
  {
    return true;
  }
}

export=TemplateTagFactory;
