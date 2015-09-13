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
import RenderStageChainManager = require("./RenderStageChainManager");
import TextureGenerater = require("./TextureGenerater");
class RenderStageManager
{
    private parentRenderer: RendererBase;
    private defaultQuad: QuadGeometry;
    private defaultCube:CubeGeometry;
    private stageName: string;

    constructor(parent: RendererBase)
    {
        this.stageName = "<<<RenderStage Initialization>>>";
        this.parentRenderer = parent;
        this.parentRenderer.GLContext.glError((o, s) =>
        {
            console.error(`GL ERROR OCCURED:STAGE INFO:${this.stageName} ERROR INFO:${s}`);
        });
        this.defaultQuad = new QuadGeometry("jthree.renderstage.default.quad");
        this.defaultCube = new CubeGeometry("jthree.renderstage.default.cube");
    }



    private stageChainManager = new RenderStageChainManager();

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
            var tex = context.ResourceManager.getTexture(this.parentRenderer.ID + "." + bufferName);
            texInfo[targetName] = tex;
        }
        return texInfo;
    }

    public get StageChains(): RenderStageChain[]
    {
        return this.stageChainManager.stageChains;
    }

    public get StageChainManager()
    {
      return this.stageChainManager;
    }

    public processRender(scene: Scene, sceneObjects: SceneObject[])
    {
        this.stageChainManager.stageChains.forEach(chain=>
        {
            this.stageName = "initialization of " + chain.stage.getTypeName();
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
                    targetObjects = sceneObjects;
            }
            stage.applyStageConfig();
            for (var i = 0; i < techniqueCount; i++)
            {
                this.stageName = "pass:" + i + " pre begin stage of" + chain.stage.getTypeName();
                stage.preBeginStage(scene, i, texs);
                targetObjects.forEach(v=>
                {
                    v.callRecursive(v=>
                    {
                        if (v.Geometry&&stage.needRender(scene, v, i))
                        {
                            this.stageName = "pass:" + i + "render" + chain.stage.getTypeName() + "target:" + v.Geometry.getTypeName();
                            stage.render(scene, v, i, texs);

                        }
                    });
                });
                this.stageName = "pass:" + i + "post begin stage of" + chain.stage.getTypeName();
                stage.postEndStage(scene, i, texs);
            }
        });
    }
}

export =RenderStageManager;
