import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene');
import FBO = require('../../Resources/FBO/FBO');
import RBO = require('../../Resources/RBO/RBO');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import JThreeContextProxy = require('../../JThreeContextProxy')
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
class FowardShadingStage extends RenderStageBase {
	constructor(renderer: RendererBase) {
		super(renderer);
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [{
			texture: texs["OUT"],
			target: 0,
			isOptional: false
		},
		{
			texture:this.DefaultRBO,
			target:"depth",
			type:"rbo"
		}], () => {
			this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits)
		});
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		var material = object.getMaterial("jthree.materials.forematerial");
		if (!material || !material.Loaded) return;
		material.configureMaterial(scene, this.Renderer, object, texs);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}
}

export = FowardShadingStage;