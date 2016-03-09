import SceneObjectNodeBase from "../SceneObjectNodeBase";
class CameraNodeBase extends SceneObjectNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "camera";
        this.attributes.getAttribute("name").on("changed", this._onNameAttrChanged.bind(this));
    }
    /**
     * Construct camera. This method should be overridden.
     * @return {Camera} [description]
     */
    __constructCamera() {
        return null;
    }
    /**
     * Construct camera and set to TargetSceneObject.
     * This Node is exported.
     */
    __onMount() {
        super.__onMount();
        this.TargetSceneObject = this.__constructCamera();
    }
    /**
     * Export node when name attribute changed.
     * @param {GomlAttribute} attr [description]
     */
    _onNameAttrChanged(attr) {
        const name = attr.Value;
        if (typeof name !== "string") {
            throw Error(`${this.getTypeName()}: name attribute must be required.`);
        }
        this.nodeExport(name);
        attr.done();
    }
}
export default CameraNodeBase;
