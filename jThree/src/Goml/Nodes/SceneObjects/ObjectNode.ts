import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Mesh = require("../../../Shapes/Mesh");
import TemplateNode = require("../Templates/TemplateNode");

class ObjectNode extends SceneObjectNodeBase
{
  private targetObject:SceneObject;

  private targetTemplate:TemplateNode;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      var templateName=elem.getAttribute("template");
      if(templateName)
      {
        this.targetTemplate=<TemplateNode>this.loader.nodeRegister.getObject("jthree.template",templateName);
        this.loader.instanciateTemplate(this.targetTemplate.GetGomlToInstanciate(this.element),this);
      }
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
