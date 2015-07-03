import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene');
import FBO = require('../../Resources/FBO/FBO');
import RBO =require('../../Resources/RBO/RBO');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class FowardShadingStage extends RenderStageBase {
	private fbo:FBO;
	
	private rbo:RBO;
	
	constructor(renderer: RendererBase) {
		super(renderer);
	}
	
	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.Renderer.GLContext.BindFrameBuffer(null);
	}

	public render(scene:Scene,object: SceneObject,passCount:number,texs:ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		var material=object.getMaterial("jthree.materials.forematerial");
		material.configureMaterial(scene,this.Renderer, object,texs);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene:Scene,object: SceneObject,passCount:number): boolean {
		return true;
	}
}

export = FowardShadingStage;