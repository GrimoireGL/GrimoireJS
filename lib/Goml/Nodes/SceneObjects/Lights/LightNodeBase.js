import SceneObjectNodeBase from "../SceneObjectNodeBase";
class LightNodeBase extends SceneObjectNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "color": {
                value: "white",
                converter: "color3",
                onchanged: this._onColorAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onColorAttrChanged.call(this, this.attributes.getAttribute("color"));
        });
    }
    /**
     * Construct target light object when this method was called.
   * This method should be overridden.
     */
    __constructLight() {
        return null;
    }
    __onMount() {
        super.__onMount();
        this.TargetSceneObject = this.__constructLight();
    }
    _onColorAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.Color = attr.Value;
            attr.done();
        }
    }
}
export default LightNodeBase;
