import RendererBase = require("../RendererBase");
import SceneObject = require("../../SceneObject");
import RenderStageBase = require("./RenderStageBase");
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require("../../Scene");
import ResolvedChainInfo = require("../ResolvedChainInfo");
class RB1RenderStage extends RenderStageBase {

	constructor(renderer: RendererBase) {
		super(renderer);

	}


	public preBeginStage(scene: Scene, passCount: number, chainInfo: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [
			{
				texture:chainInfo["OUT"],
				target:0
			},
			{
				texture:this.DefaultRBO,
				target:"depth",
				type:"rbo"
			}
		], () => {
			this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
			this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
		});
	}

	public render(scene: Scene, object: SceneObject, passCount: number) {
		var geometry = object.Geometry;
		if (!geometry) return;
		var mats = object.getMaterials("jthree.materials.normal");
		if(!mats||mats.length<1)return;
		var materials = mats;
		for (var i = 0; i < materials.length; i++) {
			var material = materials[i];
			if (!material || !material.Loaded) return;
			for (var pass = 0; pass < material.PassCount; pass++) {
				material.configureMaterial(scene, this.Renderer, object,null,pass);
				geometry.drawElements(this.Renderer.ContextManager, material);
			}
		}
	}


	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}
}
export = RB1RenderStage;