import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import SceneObjectNodeBase = require("./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
import SceneNode = require("../../Goml/Nodes/SceneNode");
import SceneObject = require("../../Core/SceneObject");
import PMXModel= require('../Core/PMXModel');
class PMXNode extends SceneObjectNodeBase
{
  private pmxModel:PMXModel=null;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      this.attributes.defineAttribute(
        {
          "url":
          {
            converter:"string",value:""
          }
        }
      )
  }

  protected ConstructTarget():SceneObject
  {
    return this.pmxModel;
  }

  beforeLoad()
  {
    super.beforeLoad();
    PMXModel.LoadFromUrl(this.attributes.getValue("url"),(m)=>{
      this.pmxModel=m;
      this.targetUpdated();
    });
  }

  Load()
  {
    super.Load();
  }

}

export=PMXNode;
