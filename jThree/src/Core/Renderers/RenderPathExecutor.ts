import RendererBase = require('./RendererBase');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import RenderStageChain = require('./RenderStageChain');
import JThreeContextProxy = require('./../JThreeContextProxy');
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

class RenderPathExecutor
{
    public renderStageCompleted:JThreeEvent<IRenderStageCompletedEventArgs> = new JThreeEvent<IRenderStageCompletedEventArgs>();

    private parentRenderer: RendererBase;
    private defaultQuad: QuadGeometry;
    private defaultCube:CubeGeometry;

    constructor(parent: RendererBase)
    {
        this.parentRenderer = parent;
        this.defaultQuad = new QuadGeometry("jthree.renderstage.default.quad");
        this.defaultCube = new CubeGeometry("jthree.renderstage.default.cube");
    }

    private textureBuffers: GeneraterInfo = {};

    public get TextureBuffers()
    {
        return this.textureBuffers;
    }

    public set TextureBuffers(val: GeneraterInfo)
    {
        this.textureBuffers = val;
    }


	/**
	 * Generate all textures subscribed to TextureBuffers
	 */
    public generateAllTextures()
    {
        for (var name in this.textureBuffers)
        {
          TextureGenerater.generateTexture(this.parentRenderer,name,this.textureBuffers[name]);
        }
    }

    private genChainTexture(chain: RenderStageChain): ResolvedChainInfo
    {
        var texInfo: ResolvedChainInfo = {};
        var context = JThreeContextProxy.getJThreeContext();
        for (var targetName in chain.buffers)
        {
            var bufferName = chain.buffers[targetName];
            if (bufferName == 'default')
            {
                texInfo[targetName] = null;//default buffer
                continue;
            }
            var tex = TextureGenerater.getTexture(this.parentRenderer,bufferName);
            texInfo[targetName] = tex;
        }
        return texInfo;
    }

    public processRender(scene: Scene,renderPath:RenderPath)
    {
        var stageIndex = 0;
        renderPath.path.forEach(chain=>
        {
            var texs = this.genChainTexture(chain);
            var stage = chain.stage;
            var techniqueCount = stage.getTechniqueCount(scene);
            var targetObjects: SceneObject[];
            switch (stage.TargetGeometry)
            {
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
            stage.preAllStage(scene,texs);
            stage.applyStageConfig();
            for (var i = 0; i < techniqueCount; i++)
            {
                stage.preBeginStage(scene, i, texs);
                targetObjects.forEach(v=>
                {
                    v.callRecursive(v=>
                    {
                        if (v.Geometry&&stage.needRender(scene, v, i))
                        {
                            stage.render(scene, v, i, texs);

                        }
                    });
                });
                stage.postEndStage(scene, i, texs);
            }
            stage.postAllStage(scene,texs);
            this.renderStageCompleted.fire(this,{
              owner:this,
              completedChain:chain,
              bufferTextures:texs,
              index:stageIndex
            });
            stageIndex++;
        });
    }
}

export =RenderPathExecutor;
