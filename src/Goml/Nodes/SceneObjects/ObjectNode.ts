import SceneObjectNodeBase from "./SceneObjectNodeBase";
import SceneObject from "../../../Core/SceneObjects/SceneObject";
// import GomlParser from "../../GomlParser.ts";

class ObjectNode extends SceneObjectNodeBase<SceneObject> {
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

  protected __onMount(): void {
    super.__onMount();
    this.TargetSceneObject = new SceneObject();
  }
}

export default ObjectNode;
