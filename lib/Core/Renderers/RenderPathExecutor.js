import JThreeObjectEE from "../../Base/JThreeObjectEE";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import Mesh from "../SceneObjects/Mesh";
/**
 * All rendering path should be executed with this class.
 *
 * @type {[type]}
 */
class RenderPathExecutor extends JThreeObjectEE {
    constructor(parent) {
        super();
        this.renderer = parent;
    }
    processRender(scene, renderPath) {
        let stageIndex = 0;
        renderPath.path.forEach(chain => {
            try {
                const texs = this._genChainTexture(chain);
                const stage = chain.stage;
                const techniqueCount = stage.getTechniqueCount(scene);
                let targetObjects;
                stage.preStage(scene, texs);
                for (let techniqueIndex = 0; techniqueIndex < techniqueCount; techniqueIndex++) {
                    switch (stage.getTarget(techniqueIndex)) {
                        case "scene":
                            targetObjects = scene.children;
                            break;
                        default:
                            const pr = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory);
                            const geometry = pr.getPrimitive(stage.getTarget(techniqueIndex));
                            if (!geometry) {
                                console.error(`Unknown primitive ${stage.getTarget(techniqueIndex)} was specified!`);
                                continue;
                            }
                            else {
                                targetObjects = [new Mesh(geometry, null)];
                            }
                    }
                    stage.stageVariables = chain.variables;
                    stage.preTechnique(scene, techniqueIndex, texs);
                    this._renderObjects(targetObjects, stage, scene, techniqueCount, techniqueIndex, texs, chain);
                    stage.postTechnique(scene, techniqueIndex, texs);
                }
                stage.postStage(scene, texs);
                this.emit("rendered-stage", {
                    owner: this,
                    completedChain: chain,
                    bufferTextures: texs,
                    index: stageIndex
                });
                stageIndex++;
            }
            catch (e) {
                throw e;
            }
        });
        this.emit("rendered-path", {
            owner: this,
            scene: scene
        });
    }
    _renderObjects(targetObjects, stage, scene, techniqueCount, techniqueIndex, texs, chain) {
        targetObjects.forEach(v => {
            v.callRecursive(_v => {
                if (_v.Geometry && stage.needRender(scene, _v, techniqueIndex)) {
                    stage.render(scene, _v, techniqueCount, techniqueIndex, texs);
                    this.emit("rendered-object", {
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
    _genChainTexture(chain) {
        const texInfo = {};
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
