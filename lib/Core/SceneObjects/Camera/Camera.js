import SceneObject from "../SceneObject";
import Matrix from "../../../Math/Matrix";
import { mat4 } from "gl-matrix";
import PointList from "../../../Math/PointList";
/**
 * Basement class of Camera. These class related to camera are one of SceneObject in jThree.
 */
class Camera extends SceneObject {
    constructor(...args) {
        super(...args);
        this.viewProjectionMatrix = new Matrix();
        this.viewProjectionInvMatrix = new Matrix();
        /**
         * View frustum vertex points in World space
         */
        this.frustumPoints = new PointList();
        this.viewMatrix = new Matrix();
        this.projectionMatrix = new Matrix();
        this.invProjectionMatrix = new Matrix();
    }
    get Far() {
        return 0;
    }
    get Near() {
        return 0;
    }
    __updateViewProjectionMatrix() {
        mat4.mul(this.viewProjectionMatrix.rawElements, this.projectionMatrix.rawElements, this.viewMatrix.rawElements);
        mat4.invert(this.viewProjectionInvMatrix.rawElements, this.viewProjectionMatrix.rawElements);
        PointList.initializeWithCube(this.frustumPoints);
        this.frustumPoints.transform(this.viewProjectionInvMatrix);
    }
    update() {
        super.update();
    }
    onParentSceneChanged() {
        this.ParentScene.addCamera(this);
    }
}
export default Camera;
