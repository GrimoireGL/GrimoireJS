import Matrix from "../../Math/Matrix";
import JThreeObjectEE from "../../Base/JThreeObjectEE";
import SceneObject from "../SceneObjects/SceneObject";
abstract class BaseTransformer extends JThreeObjectEE {
  public object: SceneObject;

  /**
   * calculation cache
   */
  protected __localTransformMatrix: Matrix = Matrix.identity();

  protected __localToGlobalMatrix: Matrix = Matrix.identity();

  constructor(sceneObject: SceneObject) {
    super();
    this.object = sceneObject;
  }
}
export default BaseTransformer;
