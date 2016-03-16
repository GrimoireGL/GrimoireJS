import IRenderer from "./IRenderer";
import RenderStageBase from "./RenderStages/RenderStageBase";
import PrimitiveRegistory from "../Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import RenderStageChain from "./RenderStageChain";
import SceneObject from "../SceneObjects/SceneObject";
import Mesh from "../SceneObjects/Mesh";
import Scene from "../Scene";
import BufferInput from "./BufferInput";
import IRenderStageCompletedEventArgs from "./IRenderStageCompletedEventArgs";
import IRenderPathCompletedEventArgs from "./IRenderPathCompletedEventArgs";
import IRenderObjectCompletedEventArgs from "./IRenderObjectCompletedEventArgs";
/**
 * All rendering path should be executed with this class.
 *
 * @type {[type]}
 */
class RenderPathExecutor {
  public static processRender(renderer: IRenderer, scene: Scene): void {
    let stageIndex = 0;
    renderer.renderPath.path.forEach(chain => {
      try {
        const texs = RenderPathExecutor._genChainTexture(renderer, chain);
        const stage = chain.stage;
        const techniqueCount = stage.getTechniqueCount(scene);
        let targetObjects: SceneObject[];
        stage.preStage(scene, texs);
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
          stage.stageVariables = chain.variables;
          stage.preTechnique(scene, techniqueIndex, texs);
          RenderPathExecutor._renderObjects(renderer, targetObjects, stage, scene, techniqueCount, techniqueIndex, texs, chain);
          stage.postTechnique(scene, techniqueIndex, texs);
        }
        stage.postStage(scene, texs);
        renderer.emit("rendered-stage", <IRenderStageCompletedEventArgs>{
          completedChain: chain,
          bufferTextures: renderer.bufferSet,
          index: stageIndex
        });
        stageIndex++;
      } catch (e) {
        throw e;
      }
    });
    renderer.emit("rendered-path", <IRenderPathCompletedEventArgs> {
      owner: this,
      scene: scene
    });
  }

  private static _renderObjects(renderer: IRenderer, targetObjects: SceneObject[], stage: RenderStageBase, scene: Scene, techniqueCount: number, techniqueIndex: number, texs: BufferInput, chain: RenderStageChain): void {
    targetObjects.forEach(v => {
      v.callRecursive(_v => {
        if (_v.Geometry && stage.needRender(scene, _v, techniqueIndex)) {
          stage.render(scene, _v, techniqueCount, techniqueIndex, texs);
          renderer.emit("rendered-object", <IRenderObjectCompletedEventArgs>{
            owner: this,
            renderedObject: _v,
            stage: stage,
            stageChain: chain,
            bufferTextures: texs,
            technique: techniqueIndex
          });
        }
      });
    });
  }

  private static _genChainTexture(renderer: IRenderer, chain: RenderStageChain): BufferInput {
    const texInfo: BufferInput = {
      defaultRenderBuffer: renderer.defaultRenderBuffer
    };
    for (let targetName in chain.buffers) {
      const bufferName = chain.buffers[targetName];
      const tex = renderer.bufferSet.getColorBuffer(bufferName);
      texInfo[targetName] = tex;
    }
    return texInfo;
  }

}

export default RenderPathExecutor;
