import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
import PMXModel from "../Core/PMXModel";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceLoader from "../../Core/ResourceLoader";
import Q from "q";

class PMXNode extends SceneObjectNodeBase<PMXModel> {
  private pmxModel: PMXModel = null;

  public get PMXModel() {
    return this.pmxModel;
  }

  public get PMXModelReady() {
    return this.PMXModel != null;
  }

  private pmxLoadingDeferred: Q.Deferred<void>;

  constructor() {
    super();
    this.pmxLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered<void>();
    this.attributes.defineAttribute({
      "src": {
        converter: "string",
        value: "",
        onchanged: (attr) => {
          attr.done();
        }
      }
    });
  }

  public onMount(): void {
    super.onMount();
    PMXModel.LoadFromUrl(this.attributes.getValue("src"))
      .then((m) => {
      this.pmxModel = m;
      this.TargetSceneObject = this.pmxModel;
      this.pmxLoadingDeferred.resolve(null);
    });
  }
}

export default PMXNode;
