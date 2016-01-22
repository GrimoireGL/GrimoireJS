import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import glm = require("gl-matrix");
import PointList = require("../../Math/PointList");

/**
 * Basement class of Camera. These class related to camera are one of SceneObject in jThree.
 */
abstract class Camera extends SceneObject {
  public viewProjectionMatrix: Matrix = new Matrix();

  public viewProjectionInvMatrix: Matrix = new Matrix();

	/**
	 * View frustum vertex points in World space
	 */
  public frustumPoints: PointList = new PointList();

  public viewMatrix: Matrix = new Matrix();

  public projectionMatrix: Matrix = new Matrix();

  public invProjectionMatrix: Matrix = new Matrix();

  protected __updateViewProjectionMatrix() {
    glm.mat4.mul(this.viewProjectionMatrix.rawElements, this.projectionMatrix.rawElements, this.viewMatrix.rawElements);
    glm.mat4.invert(this.viewProjectionInvMatrix.rawElements, this.viewProjectionMatrix.rawElements);
    PointList.initializeWithCube(this.frustumPoints);
    this.frustumPoints.transform(this.viewProjectionInvMatrix);
  }

  public update(): void {
    super.update();
  }

  public onParentSceneChanged() {
    this.ParentScene.addCamera(this);
  }
}

export = Camera;
