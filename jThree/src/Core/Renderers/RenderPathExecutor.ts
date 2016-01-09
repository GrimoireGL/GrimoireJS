import BasicRenderer = require('./BasicRenderer');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import RenderStageChain = require('./RenderStageChain');
import SceneObject = require('../SceneObject');
import Mesh = require('../../Shapes/Mesh')
import Scene = require('../Scene');
import QuadGeometry = require('../Geometries/QuadGeometry');
import ResolvedChainInfo = require('./ResolvedChainInfo');
import GeneraterInfo = require('./TextureGeneraters/GeneraterInfo');
import GeneraterBase = require('./TextureGeneraters/GeneraterBase');
import CubeGeometry = require("../Geometries/CubeGeometry");
import RenderPath = require("./RenderPath");
import TextureGenerater = require("./TextureGenerater");
import JThreeEvent = require("../../Base/JThreeEvent");
import IRenderStageCompletedEventArgs = require("./IRenderStageCompletedEventArgs");
import IRenderPathCompletedEventArgs = require("./IRenderPathCompletedEventArgs");
import IRenderObjectCompletedEventArgs = require("./IRenderObjectCompletedEventArgs");
/**
 * All rendering path should be executed with this class.
 *
 * @type {[type]}
 */
class RenderPathExecutor {
    public renderStageCompleted: JThreeEvent<IRenderStageCompletedEventArgs> = new JThreeEvent<IRenderStageCompletedEventArgs>();

    public renderPathCompleted: JThreeEvent<IRenderPathCompletedEventArgs> = new JThreeEvent<IRenderPathCompletedEventArgs>();

    public renderObjectCompleted: JThreeEvent<IRenderObjectCompletedEventArgs> = new JThreeEvent<IRenderObjectCompletedEventArgs>();

    public renderer: BasicRenderer;
    private defaultQuad: QuadGeometry;
    private defaultCube: CubeGeometry;

    constructor(parent: BasicRenderer) {
        this.renderer = parent;
        this.defaultQuad = new QuadGeometry("jthree.renderstage.default.quad");
        this.defaultCube = new CubeGeometry("jthree.renderstage.default.cube");
    }

    private textureBuffers: GeneraterInfo = {};

    public get TextureBuffers() {
        return this.textureBuffers;
    }

    public set TextureBuffers(val: GeneraterInfo) {
        this.textureBuffers = val;
    }


	/**
	 * Generate all textures subscribed to TextureBuffers
	 */
    public generateAllTextures() {
        for (var name in this.textureBuffers) {
            TextureGenerater.generateTexture(this.renderer, name, this.textureBuffers[name]);
        }
    }

    private genChainTexture(chain: RenderStageChain): ResolvedChainInfo {
        var texInfo: ResolvedChainInfo = {};
        for (var targetName in chain.buffers) {
            var bufferName = chain.buffers[targetName];
            if (bufferName == 'default') {
                texInfo[targetName] = null;//default buffer
                continue;
            }
            var tex = TextureGenerater.getTexture(this.renderer, bufferName);
            texInfo[targetName] = tex;
        }
        return texInfo;
    }

    public processRender(scene: Scene, renderPath: RenderPath) {
        var stageIndex = 0;
        renderPath.path.forEach(chain => {
            try {
                var texs = this.genChainTexture(chain);
                var stage = chain.stage;
                var techniqueCount = stage.getTechniqueCount(scene);
                var targetObjects: SceneObject[];
                stage.preStage(scene, texs);
                //stage.applyStageConfig();
                for (var i = 0; i < techniqueCount; i++) {
                    switch (stage.getTarget(i)) {
                        case "quad":
                            targetObjects = [new Mesh(this.defaultQuad, null)];
                            break;
                        case "cube":
                            targetObjects = [new Mesh(this.defaultCube, null)];
                            break;
                        case "scene":
                        default:
                            targetObjects = scene.children;
                    }
                    stage.preTechnique(scene, i, texs);
                    targetObjects.forEach(v => {
                        v.callRecursive(v => {
                            if (v.Geometry && stage.needRender(scene, v, i)) {
                                stage.render(scene, v, i, texs);
                                this.renderObjectCompleted.fire(this, {
                                    owner: this,
                                    renderedObject: v,
                                    stage: stage,
                                    stageChain: chain,
                                    bufferTextures: texs,
                                    technique: i
                                });
                            }
                        });
                    });
                    stage.postTechnique(scene, i, texs);
                }
                stage.postStage(scene, texs);
                this.renderStageCompleted.fire(this, {
                    owner: this,
                    completedChain: chain,
                    bufferTextures: texs,
                    index: stageIndex
                });
                stageIndex++;
            } catch (e) {
                // debugger;
            }
        });
        this.renderPathCompleted.fire(this, {
            owner: this,
            scene: scene
        })
    }
}

export =RenderPathExecutor;
