import BasicRenderer = require('../BasicRenderer');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import RenderStageConfig = require("../RenderStageConfig");
class FowardShadingStage extends RenderStageBase
{
	constructor(renderer: BasicRenderer) {
		super(renderer);
	}

	public preTechnique(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [{
				texture: null,
				target: "depth",
				type: "rbo"
			},{
			texture: texs["OUT"],
			target: 0,
			isOptional: false
		}], () => {
		    this.Renderer.GL.clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
		},()=>{
				this.Renderer.GL.clear(ClearTargetType.DepthBits);
			});
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
        this.drawForMaterials(scene, object, passCount, texs,"jthree.materials.forematerial");
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry != "undefined" && object.Geometry != null;
	}
}

export = FowardShadingStage;
