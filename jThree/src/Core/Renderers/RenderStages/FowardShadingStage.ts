import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import JThreeContextProxy = require('../../JThreeContextProxy')
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
class FowardShadingStage extends RenderStageBase {
	constructor(renderer: RendererBase) {
		super(renderer);
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
/*		this.bindAsOutBuffer(this.DefaultFBO, [{
				texture: null,
				target: "depth",
				type: "rbo"
			},{
			texture: texs["OUT"],
			target: 0,
			isOptional: false
		},], () => {
		    this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
		},()=>{
				this.Renderer.ContextManager.applyClearColor();
				this.Renderer.GLContext.Clear(ClearTargetType.DepthBits);
			});*/
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		var materials = object.getMaterials("jthree.materials.forematerial");
		for (var i = 0; i < materials.length; i++) {
			var material = materials[i];
			if (!material || !material.Loaded) return;
			for (var pass = 0; pass < material.PassCount; pass++) {
				material.configureMaterial(scene, this.Renderer, object, texs,pass);
				geometry.drawElements(this.Renderer.ContextManager, material);
			}
		}
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry != "undefined" && object.Geometry != null;
	}
}

export = FowardShadingStage;