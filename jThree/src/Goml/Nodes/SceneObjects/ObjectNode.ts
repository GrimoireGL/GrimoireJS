import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import JThreeID = require("../../../Base/JThreeID");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Mesh = require("../../../Shapes/Mesh");
import GeometryNodeBase = require("../Geometries/GeometryNodeBase");
import MaterialNode = require("../Materials/SolidColorNode");
import SolidColor = require("../../../Core/Materials/SolidColorMaterial");
import TemplateNode = require("../Templates/TemplateNode");

class ObjectNode extends SceneObjectNodeBase
{
  private targetMesh:Mesh;
  
  private targetTemplate:TemplateNode;  
  
  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
    debugger;
      super(elem,loader,parent,parentSceneNode,parentObject);
      var templateName=elem.getAttribute("template");
      if(templateName)
      {
        this.targetTemplate=<TemplateNode>this.loader.nodeRegister.getObject("jthree.template",templateName);
        this.loader.instanciateTemplate(this.targetTemplate.TemplateGoml,this);
      }
  }

  protected ConstructTarget():SceneObject
  {
    this.targetMesh=new Mesh(null,null);
    return this.targetMesh;
  }

  beforeLoad()
  {
    super.beforeLoad();
  }

  Load()
  {
    super.Load();
  }

}

export=ObjectNode;
