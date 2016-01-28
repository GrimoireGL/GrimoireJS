import SceneObjectNodeBase = require("./SceneObjectNodeBase");
import SceneObject = require("../../../Core/SceneObjects/SceneObject");
// import GomlParser = require("../../GomlParser.ts");

class ObjectNode extends SceneObjectNodeBase {
  // private targetTemplate: TemplateNode;

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

  protected onMount(): void {
    super.onMount();
    this.TargetSceneObject = new SceneObject();
  }
}

export = ObjectNode;
