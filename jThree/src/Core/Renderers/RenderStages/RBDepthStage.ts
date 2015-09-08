import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import RenderStageConfig = require("../RenderStageConfig");
declare function require(target: string): any;
class RBDepthStage extends RenderStageBase {

	private rbDepthProgram: Program;

	constructor(renderer: RendererBase) {
		super(renderer);
	}


	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [
			{
				texture: texs["OUT"],
				target: 0
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
		var mats = object.getMaterials("jthree.materials.depth");
		if(!mats||mats.length<1)return;
		var materials = mats;
		for (var i = 0; i < materials.length; i++) {
			var material = materials[i];
			if (!material || !material.Loaded) return;
			for (var pass = 0; pass < material.PassCount; pass++) {
				material.configureMaterial(scene, this.Renderer, object,null,passCount,pass);
				geometry.drawElements(this.Renderer.ContextManager, material);
			}
		}
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}

	public getTechniqueCount(scene: Scene) {
		return 1;
    }

    public get RenderStageConfig(): RenderStageConfig
    {
        return {
            cullFace: true,
            cullFront: false,
            depthTest: true,
            blend: false
        };
    }

}
export = RBDepthStage;