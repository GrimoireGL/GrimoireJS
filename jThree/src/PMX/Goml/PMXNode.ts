import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import SceneObjectNodeBase = require("./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
import SceneNode = require("../../Goml/Nodes/SceneNode");
import SceneObject = require("../../Core/SceneObject");
import PMXModel= require('../Core/PMXModel');
import JThreeEvent = require('../../Base/JThreeEvent');
import Delegates = require('../../Base/Delegates');
class PMXNode extends SceneObjectNodeBase
{
  private pmxModel:PMXModel=null;

  public get PMXModel()
  {
    return this.pmxModel;
  }

  public get PMXModelReady()
  {
    return this.PMXModel != null;
  }

  private pmxTargetUpdated: JThreeEvent<PMXModel> = new JThreeEvent<PMXModel>();

  public onPMXTargetUpdate(handler:Delegates.Action2<PMXNode,PMXModel>)
  {
    this.pmxTargetUpdated.addListerner(handler);
  }

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:SceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      this.attributes.defineAttribute(
        {
          "src":
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
    PMXModel.LoadFromUrl(this.attributes.getValue("src"),(m)=>{
      this.pmxModel=m;
      this.targetUpdated();
      this.pmxTargetUpdated.fire(this,m);
    });
  }

  protected targetUpdated()
  {
    super.beforeLoad();
  }

  Load()
  {
    super.Load();
  }

}

export=PMXNode;
