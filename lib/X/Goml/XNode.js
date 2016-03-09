import XModel from "../Core/XModel";
import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
class XNode extends SceneObjectNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "src": {
                converter: "string",
                value: undefined,
                constant: true
            }
        });
    }
    __onMount() {
        super.__onMount();
        XModel.fromUrl(this.attributes.getValue("src"))
            .then((m) => {
            this.TargetSceneObject = m;
        });
    }
}
export default XNode;
