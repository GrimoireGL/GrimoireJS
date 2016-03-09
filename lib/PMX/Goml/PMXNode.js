import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
import PMXModel from "../Core/PMXModel";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class PMXNode extends SceneObjectNodeBase {
    constructor() {
        super();
        this._pmxModel = null;
        this._pmxLoadingDeferred = JThreeContext.getContextComponent(ContextComponents.ResourceLoader).getResourceLoadingDeffered();
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
    get PMXModel() {
        return this._pmxModel;
    }
    get PMXModelReady() {
        return this.PMXModel != null;
    }
    __onMount() {
        super.__onMount();
        PMXModel.loadFromUrl(this.attributes.getValue("src"))
            .then((m) => {
            this._pmxModel = m;
            this.TargetSceneObject = this._pmxModel;
            this._pmxLoadingDeferred.resolve(null);
        });
    }
}
export default PMXNode;
