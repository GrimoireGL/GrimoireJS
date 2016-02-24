import JThreeObjectEE from "../../Base/JThreeObjectEE";
import RenderStageBase from "./RenderStages/RenderStageBase";
import PrimitiveRegistory from "../Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import BasicRenderer from "./BasicRenderer";
import RenderStageChain from "./RenderStageChain";
import SceneObject from "../SceneObjects/SceneObject";
import Mesh from "../SceneObjects/Mesh";
import Scene from "../Scene";
import ResolvedChainInfo from "./ResolvedChainInfo";
import RenderPath from "./RenderPath";
import IRenderStageCompletedEventArgs from "./IRenderStageCompletedEventArgs";
import IRenderPathCompletedEventArgs from "./IRenderPathCompletedEventArgs";
import IRenderObjectCompletedEventArgs from "./IRenderObjectCompletedEventArgs";
/**
 * All rendering path should be executed with this class.
 *
 * @type {[type]}
 */
class RenderPathExecutor extends JThreeObjectEE {
  public renderer: BasicRenderer;

  constructor(parent: BasicRenderer) {
    super();
    this.renderer = parent;
  }

  public processRender(scene: Scene, renderPath: RenderPath): void {
    let stageIndex = 0;
    renderPath.path.forEach(chain => {
      try {
        const texs = this.genChainTexture(chain);
        const stage = chain.stage;
        const techniqueCount = stage.getTechniqueCount(scene);
        let targetObjects: SceneObject[];
        stage.preStage(scene, texs);
        for (let techniqueIndex = 0; techniqueIndex < techniqueCount; techniqueIndex++) {
          switch (stage.getTarget(techniqueIndex)) {
            case "scene":
              targetObjects = scene.children;
              break;
            default:
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
          this.renderObjects(targetObjects, stage, scene, techniqueCount, techniqueIndex, texs, chain);
          stage.postTechnique(scene, techniqueIndex, texs);
        }
        stage.postStage(scene, texs);
        this.emit("rendered-stage", <IRenderStageCompletedEventArgs>{
          owner: this,
          completedChain: chain,
          bufferTextures: texs,
          index: stageIndex
        });
        stageIndex++;
      } catch (e) {
        throw e;
      }
    });
    this.emit("rendered-path", <IRenderPathCompletedEventArgs> {
      owner: this,
      scene: scene
    });
  }

  private renderObjects(targetObjects: SceneObject[], stage: RenderStageBase, scene: Scene, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo, chain: RenderStageChain): void {
    targetObjects.forEach(v => {
      v.callRecursive(_v => {
        if (_v.Geometry && stage.needRender(scene, _v, techniqueIndex)) {
          stage.render(scene, _v, techniqueCount, techniqueIndex, texs);
          this.emit("rendered-object", <IRenderObjectCompletedEventArgs>{
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

  private genChainTexture(chain: RenderStageChain): ResolvedChainInfo {
    const texInfo: ResolvedChainInfo = {};
    for (let targetName in chain.buffers) {
      const bufferName = chain.buffers[targetName];
      if (bufferName === "default") {
        texInfo[targetName] = null; // default buffer
        continue;
      }
      const tex = this.renderer.bufferSet.getColorBuffer(bufferName);
      texInfo[targetName] = tex;
    }
    return texInfo;
  }

}

export default RenderPathExecutor;
