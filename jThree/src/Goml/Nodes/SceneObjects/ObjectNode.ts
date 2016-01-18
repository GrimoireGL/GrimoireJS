import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneNode = require("../SceneNode");
import SceneObject = require("../../../Core/SceneObject");
import Mesh = require("../../../Shapes/Mesh");
import TemplateNode = require("../Templates/TemplateNode");
import Delegate = require("../../../Base/Delegates");;
// import GomlParser = require("../../GomlParser.ts");

class ObjectNode extends SceneObjectNodeBase {
  private targetObject: SceneObject;

  private targetTemplate: TemplateNode;

  constructor() {
    super();
    // TODO: pnly
    // var templateName=elem.getAttribute("template");
    // if(templateName)
    // {
    //   this.targetTemplate=<TemplateNode>this.nodeManager.nodeRegister.getObject("jthree.template",templateName);
    // GomlParser.instanciateTemplate(this.targetTemplate.GetGomlToInstanciate(this.element),this);
    // }
  }

  protected ConstructTarget(callbackfn: Delegate.Action1<SceneObject>): void {
    this.targetObject = new SceneObject();
    callbackfn(this.targetObject);
  }

  protected onMount(): void {
    super.onMount();
  }

}

export =ObjectNode;
