import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import TextureBase = require('./../../Resources/Texture/TextureBase');
import FBO = require('./../../Resources/FBO/FBO');
import JThreeContextProxy = require('../../JThreeContextProxy');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import QuadGeometry = require('../../Geometries/QuadGeometry');
import LightAccumulationMaterial = require('../../Materials/LightAccumulationMaterial');
import Mesh = require('../../../Shapes/Mesh');
import RBO = require('../../Resources/RBO/RBO');
import Matrix = require('../../../Math/Matrix');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class RB1RenderStage extends RenderStageBase {
	private rb1Texture: TextureBase;

	private rb1FBO: FBO;

	private rb1RBO: RBO;
	
	private rb1Program:Program;

	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var width = 512, height = 512;
		var id = this.Renderer.ID;
		var rm = context.ResourceManager;
		this.rb1Texture = rm.createTexture(id + ".deffered.rb1", width, height);
		this.rb1FBO = rm.createFBO(id + ".deffered.rb1");
		this.rb1FBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0, this.rb1Texture);
		this.rb1RBO = rm.createRBO(id + ".deffered.rb1", width, height);
		this.rb1FBO.getForContext(renderer.ContextManager).attachRBO(FrameBufferAttachmentType.DepthAttachment, this.rb1RBO);
		var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../../Shaders/Deffered/RB1.glsl');
        this.rb1Program = this.loadProgram("jthree.shaders.vertex.basic","jthree.shaders.fragment.deffered.rb1","jthree.programs.rb1",vs,fs);
	}


	public preBeginStage(scene: Scene, passCount: number,chainInfo:ResolvedChainInfo) {
		this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
		this.rb1FBO.getForContext(this.Renderer.ContextManager).bind();
		this.rb1FBO.getForContext(this.Renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,chainInfo["OUT"]);
		this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);

	}

	public postEndStage(scene: Scene, passCount: number) {
		this.Renderer.GLContext.Flush();
		this.rb1FBO.getForContext(this.Renderer.ContextManager).unbind();
	}

	public render(scene: Scene, object: SceneObject, passCount: number) {
		var geometry = object.Geometry;
		if (!geometry) return;
		this.configureProgram(object);
		geometry.drawElements(this.Renderer.ContextManager);
	}
	
	private configureProgram(object:SceneObject)
	{
        var context = JThreeContextProxy.getJThreeContext();
        var geometry = object.Geometry;
        var programWrapper = this.rb1Program.getForContext(this.Renderer.ContextManager);
        programWrapper.useProgram();
        var v =object.Transformer.calculateMVPMatrix(this.Renderer);
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(this.Renderer.ContextManager));
        programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(this.Renderer.ContextManager));
        programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(this.Renderer.ContextManager));
        programWrapper.setUniformMatrix("matMVP", v);
        programWrapper.setUniformMatrix("matV", this.Renderer.Camera.ViewMatrix);
        programWrapper.setUniformMatrix("matMV", Matrix.multiply(this.Renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
        programWrapper.setUniform1i("texture", 0);
        geometry.IndexBuffer.getForRenderer(this.Renderer.ContextManager).bindBuffer();
	}
	
	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return true;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}
}
export = RB1RenderStage;