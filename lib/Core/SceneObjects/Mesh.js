import SceneObject from "../SceneObjects/SceneObject";
class Mesh extends SceneObject {
    constructor(geometry, mat) {
        super();
        if (mat) {
            this.addMaterial(mat);
        }
        if (geometry) {
            this.__geometry = geometry;
        }
    }
}
export default Mesh;
