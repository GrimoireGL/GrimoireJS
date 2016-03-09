import CoreRelatedNodeBase from "../CoreRelatedNodeBase";
import Scene from "../../Core/Scene";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class SceneNode extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "ambient": {
                value: "#111",
                converter: "color3",
                onchanged: this._onAmbientAttrChanged,
            },
            "name": {
                value: "",
                converter: "string",
                onchanged: this._onNameAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
        let sceneName = this.attributes.getValue("name");
        if (sceneName === "") {
            sceneName = null;
        }
        this.target = new Scene(sceneName);
        JThreeContext.getContextComponent(ContextComponents.SceneManager).addScene(this.target);
    }
    _onNameAttrChanged(attr) {
        this.target.ID = attr.Value;
        attr.done();
    }
    _onAmbientAttrChanged(attr) {
        this.target.sceneAmbient = attr.Value;
        attr.done();
    }
}
export default SceneNode;
