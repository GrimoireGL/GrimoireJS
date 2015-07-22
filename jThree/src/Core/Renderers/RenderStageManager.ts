import RendererBase = require('./RendererBase');
import RenderStageBase = require('./RenderStages/RenderStageBase');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import RenderStageChain = require('./RenderStageChain');
import TextureWrapperBase = require('./../Resources/Texture/TextureWrapperBase');
import JThreeContextProxy = require('./../JThreeContextProxy');
import SceneObject = require('../SceneObject');
import Mesh = require('../../Shapes/Mesh')
import Scene = require('../Scene');
import QuadGeometry = require('../Geometries/QuadGeometry');
import ResolvedChainInfo = require('./ResolvedChainInfo');
import GeneraterInfo = require('./TextureGeneraters/GeneraterInfo');
import GeneraterBase = require('./TextureGeneraters/GeneraterBase');
class RenderStageManager {
	private parentRenderer: RendererBase;
	private defaultQuad: QuadGeometry;

	constructor(parent: RendererBase) {
		this.parentRenderer = parent;
		this.defaultQuad = new QuadGeometry("jthree.renderstage.default.quad");
		this.initializeGeneraters();
	}

	private initializeGeneraters() {
		var generaters = require('./TextureGeneraters/GeneraterList');
		for (var key in generaters) {
			if (generaters.hasOwnProperty(key)) {
				var element = generaters[key];
				this.generaters.set(key, new element(this.parentRenderer));
			}
		}
	}

	private stageChains: RenderStageChain[] = [];

	private textureBuffers: GeneraterInfo = {};

	public get TextureBuffers() {
		return this.textureBuffers;
	}

	public set TextureBuffers(val: GeneraterInfo) {
		this.textureBuffers = val;
	}

	private generaters: AssociativeArray<GeneraterBase> = new AssociativeArray<GeneraterBase>();
	
	/**
	 * Provides the list of texture generaters
	 */
	public get Generaters() {
		return this.generaters;
	}
	
	/**
	 * Generate all textures subscribed to TextureBuffers
	 */
	public generateAllTextures() {
		for (var name in this.textureBuffers) {
			var textureAllocationInfo = this.textureBuffers[name];
			var generater = this.Generaters.get(textureAllocationInfo.generater);
			generater.generate(name, textureAllocationInfo);
		}
	}

	private genChainTexture(chain: RenderStageChain): ResolvedChainInfo {
		var texInfo: ResolvedChainInfo = {};
		var context = JThreeContextProxy.getJThreeContext();
		for (var targetName in chain.buffers) {
			var bufferName = chain.buffers[targetName];
			if (bufferName == 'default') {
				texInfo[targetName] = null;//default buffer
				continue;
			}
			var tex = context.ResourceManager.getTexture(this.parentRenderer.ID + "." + bufferName);
			texInfo[targetName] = tex;
		}
		return texInfo;
	}

	public get StageChains(): RenderStageChain[] {
		return this.stageChains;
	}

	public processRender(scene: Scene, sceneObjects: SceneObject[]) {
		this.stageChains.forEach(chain=> {
			var texs = this.genChainTexture(chain);
			var stage = chain.stage;
			var passCount = stage.getPassCount(scene);
			var targetObjects: SceneObject[];
			switch (stage.TargetGeometry) {
				case "quad":
					targetObjects = [new Mesh(this.defaultQuad, null)];
					break;
				case "scene":
				default:
					targetObjects = sceneObjects;
			}
			stage.applyStageConfig();
			for (var i = 0; i < passCount; i++) {
				stage.preBeginStage(scene, i, texs);
				targetObjects.forEach(v=> {
					v.callRecursive(v=> {
						if (stage.needRender(scene, v, i)) stage.render(scene, v, i, texs);
					});
				});
				stage.postEndStage(scene, i, texs);
			}
		});
	}
}

export =RenderStageManager;