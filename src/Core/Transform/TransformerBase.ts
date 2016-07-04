import Vector4 from "../../Math/Vector4";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import EEObject from "../../Base/EEObject";
import SceneObject from "../SceneObjects/SceneObject";
abstract class BaseTransformer extends EEObject {
  public object: SceneObject;

  /**
   * calculation cache
   */
  public localTransform: Matrix = Matrix.identity();

  public localToGlobal: Matrix = Matrix.identity();

  constructor(sceneObject: SceneObject) {
    super();
    this.object = sceneObject;
  }

  public transformDirection(direction: Vector3): Vector3 {
    return Matrix.transformNormal(this.localToGlobal, direction);
  }

  public transformPoint(point: Vector3): Vector3 {
    return Matrix.transformPoint(this.localToGlobal, point);
  }

  public transformVector(vector: Vector4): Vector4 {
    return Matrix.transform(this.localToGlobal, vector);
  }
}
export default BaseTransformer;
