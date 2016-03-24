import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SceneObjectNodeBase from "../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
import SceneObject from "../../Core/SceneObjects/SceneObject";

class SceneUtilities {
  public static filterSceneObjectNode(targetNodes: GomlTreeNodeBase[]): SceneObjectNodeBase<SceneObject>[] {
    return (<any[]>targetNodes).filter((node) => {
      return node instanceof SceneObjectNodeBase;
    });
  }
}

export default SceneUtilities;
