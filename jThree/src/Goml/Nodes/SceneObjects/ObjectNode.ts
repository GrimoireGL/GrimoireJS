import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Mesh = require("../../../Shapes/Mesh");
import TemplateNode = require("../Templates/TemplateNode");
// import GomlParser = require("../../GomlParser.ts");

class ObjectNode extends SceneObjectNodeBase
{
  private targetObject:SceneObject;

  private targetTemplate:TemplateNode;

  constructor(parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(parent,parentSceneNode,parentObject);
      // TODO: pnly
      // var templateName=elem.getAttribute("template");
      // if(templateName)
      // {
      //   this.targetTemplate=<TemplateNode>this.nodeManager.nodeRegister.getObject("jthree.template",templateName);
        // GomlParser.instanciateTemplate(this.targetTemplate.GetGomlToInstanciate(this.element),this);
      // }
  }

  protected ConstructTarget():SceneObject
  {
    this.targetObject=new SceneObject();
    return this.targetObject;
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }

    public Load()
  {
    super.Load();
  }

}

export=ObjectNode;