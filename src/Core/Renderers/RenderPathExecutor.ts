import BasicRenderer from "./BasicRenderer";
import RenderStageBase from "./RenderStages/RenderStageBase";
import PrimitiveRegistory from "../Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import RenderStageChain from "./RenderStageChain";
import SceneObject from "../SceneObjects/SceneObject";
import Mesh from "../SceneObjects/Mesh";
import Scene from "../Scene";
import IRenderStageCompletedEventArgs from "./IRenderStageCompletedEventArgs";
import IRenderPathCompletedEventArgs from "./IRenderPathCompletedEventArgs";
import IRenderObjectCompletedEventArgs from "./IRenderObjectCompletedEventArgs";
/**
 * All rendering path should be executed with this class.
 *
 * @type {[type]}
 */
class RenderPathExecutor {
  public static processRender(renderer: BasicRenderer, scene: Scene): void {
    let stageIndex = 0;
    renderer.renderPath.path.forEach(chain => {
      const stage = chain.stage;
      const techniqueCount = stage.getTechniqueCount(scene);
      let targetObjects: SceneObject[];
      stage.preStage(scene);
      for (let techniqueIndex = 0; techniqueIndex < techniqueCount; techniqueIndex++) {
        if (stage.getTarget(techniqueIndex) === "scene") {
          targetObjects = scene.children;
        } else {
          const pr = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory);
          const geometry = pr.getPrimitive(stage.getTarget(techniqueIndex));
          if (!geometry) {
            console.error(`Unknown primitive ${stage.getTarget(techniqueIndex) } was specified!`);
            continue;
          } else {
            targetObjects = [new Mesh(geometry, null)];
          }
        }
        stage.shaderVariables = chain.variables;
        stage.preTechnique(scene, techniqueIndex);
        RenderPathExecutor._renderObjects(renderer, targetObjects, stage, scene, techniqueCount, techniqueIndex, chain);
        stage.postTechnique(scene, techniqueIndex);
      }
      stage.postStage(scene);
      renderer.emit("rendered-stage", <IRenderStageCompletedEventArgs>{
        completedChain: chain,
        bufferTextures: stage.bufferTextures,
        index: stageIndex
      });
      stageIndex++;
    });
    renderer.emit("rendered-path", <IRenderPathCompletedEventArgs> {
      owner: this,
      scene: scene
    });
  }

  private static _renderObjects(renderer: BasicRenderer, targetObjects: SceneObject[], stage: RenderStageBase, scene: Scene, techniqueCount: number, techniqueIndex: number, chain: RenderStageChain): void {
    targetObjects.forEach(v => {
      v.callRecursive(_v => {
        if (_v.Geometry) {
          stage.render(scene, _v, techniqueCount, techniqueIndex);
          renderer.emit("rendered-object", <IRenderObjectCompletedEventArgs>{
            owner: this,
            renderedObject: _v,
            stage: stage,
            stageChain: chain,
            bufferTextures: stage.bufferTextures,
            technique: techniqueIndex
          });
        }
      });
    });
  }
}

export default RenderPathExecutor;
