import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
import PMXModel from "../Core/PMXModel";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceLoader from "../../Core/ResourceLoader";
import Q from "q";

class PMXNode extends SceneObjectNodeBase<PMXModel> {
  private _pmxModel: PMXModel = null;

  public get PMXModel() {
    return this._pmxModel;
  }

  public get PMXModelReady() {
    return this.PMXModel != null;
  }

  private _pmxLoadingDeferred: Q.Deferred<void>;

  constructor() {
    super();
    this._pmxLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered<void>();
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

  protected __onMount(): void {
    super.__onMount();
    PMXModel.loadFromUrl(this.attributes.getValue("src"))
      .then((m) => {
      this._pmxModel = m;
      this.TargetSceneObject = this._pmxModel;
      this.emit("loaded");
      this._pmxLoadingDeferred.resolve(null);
    });
  }
}

export default PMXNode;
