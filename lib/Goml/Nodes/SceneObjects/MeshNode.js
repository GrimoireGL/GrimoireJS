import SceneObjectNodeBase from "./SceneObjectNodeBase";
import BasicMeshObject from "../../../Core/SceneObjects/BasicMeshObject";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
class MeshNode extends SceneObjectNodeBase {
    constructor() {
        super();
        this._geo = null;
        this._mat = null;
        /**
         * Geomatry instance
         * @type {Geometry}
         */
        this._geo_instance = null;
        /**
         * Material instance
         */
        this._mat_instance = null;
        this.attributes.defineAttribute({
            "geo": {
                value: undefined,
                converter: "string",
                onchanged: this._onGeoAttrChanged.bind(this),
            },
            "mat": {
                value: undefined,
                converter: "string",
                onchanged: this._onMatAttrChanged.bind(this),
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    /**
     * Called when geo attribute is changed
     * @param {GomlAttribute} attr [description]
     */
    _onGeoAttrChanged(attr) {
        this._geo = attr.Value;
        this._geo_instance = null;
        // console.warn("onGeoAttrChanged", attr.Value);
        this._geo_instance = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive(this._geo);
        if (this._geo_instance) {
            // console.log("primitive exist", this.geo);
            this._updateTarget();
            attr.done();
        }
        else {
            // console.log("primitive not exist", this.geo);
            this._geo_instance = null;
            this.nodeImport("jthree.resource.geometry", this._geo, (geo) => {
                if (geo) {
                    // console.log("geometry reseived", this.geo);
                    this._geo_instance = geo.target;
                }
                else {
                    this._geo_instance = null;
                }
                this._updateTarget();
                attr.done();
            });
        }
    }
    /**
     * Called when mat attribute is changed
     * @param {GomlAttribute} attr [description]
     */
    _onMatAttrChanged(attr) {
        this._mat = attr.Value;
        this._mat_instance = null;
        // console.warn("onMatAttrChanged", attr.Value);
        this.nodeImport("jthree.resource.material", this._mat, (mat) => {
            if (mat) {
                this._mat_instance = mat.target;
            }
            else {
                this._mat_instance = null;
            }
            this._updateTarget();
            attr.done();
        });
    }
    _updateTarget() {
        if (this._geo_instance && this._mat_instance) {
            this.TargetSceneObject = new BasicMeshObject(this._geo_instance, this._mat_instance);
        }
    }
}
export default MeshNode;
