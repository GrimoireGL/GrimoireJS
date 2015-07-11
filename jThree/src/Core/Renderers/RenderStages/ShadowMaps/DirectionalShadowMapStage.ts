import JThreeObject = require('./../../../../Base/JThreeObject');
import RendererBase = require('../../RendererBase');
import SceneObject = require('../../../SceneObject');
import Material = require('../../../Materials/Material');
import RenderStageBase = require('./../RenderStageBase');
import Scene = require('../../../Scene');
import FBO = require('../../../Resources/FBO/FBO');
import RBO = require('../../../Resources/RBO/RBO');
import ResolvedChainInfo = require('../../ResolvedChainInfo');
import JThreeContextProxy = require('../../../JThreeContextProxy')
import FrameBufferAttachmentType = require('../../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../../Wrapper/ClearTargetType");
import DepthMaterial = require('../../../Materials/DepthMaterial');
import Matrix = require('../../../../Math/Matrix');
class DirectionalLightDepthStage extends RenderStageBase {
	private fbo: FBO;
	
	private mat:DepthMaterial=new DepthMaterial();
	
	private tex;
	public get VP():Matrix
	{
		return this.mat.VP;
	}
	
	public set VP(mat:Matrix)
	{
		this.mat.VP=mat;
	}
	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var rm=context.ResourceManager;
		this.fbo=this.DefaultFBO;
		var rbo=this.DefaultRBO;
		this.tex =rm.createTexture("test.direct",512,512);
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO,[
			{
				texture:texs["OUT"],
				target:"depth"
			},
			{
				texture:this.tex,
				target:0
			}
		],()=>{
			this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits)
		});
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		this.mat.configureMaterial(scene, this.Renderer, object, texs);
		geometry.drawElements(this.Renderer.ContextManager,this.mat);
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}
}

export = DirectionalLightDepthStage;