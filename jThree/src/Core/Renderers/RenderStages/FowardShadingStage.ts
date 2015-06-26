import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene')
class FowardShadingStage extends RenderStageBase {
	constructor(renderer: RendererBase) {
		super(renderer);
	}
	
	public preBeginStage()
	{
		this.Renderer.configureRenderer();
	}

	public render(scene:Scene,object: SceneObject, material: Material,passCount:number) {
		var geometry = object.Geometry;
		if (!geometry || !material) return;
		material.configureMaterial(scene,this.Renderer, object);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene:Scene,object: SceneObject, material: Material,passCount:number): boolean {
		return true;//material.NeedFoward;
	}
}

export = FowardShadingStage;