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
import Mesh = require('../../../Shapes/Mesh');
import RBO = require('../../Resources/RBO/RBO');
import Matrix = require('../../../Math/Matrix');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class RB1RenderStage extends RenderStageBase {

	private rb1Program: Program;

	constructor(renderer: RendererBase) {
		super(renderer);
		var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../../Shaders/Deffered/RB1.glsl');
        this.rb1Program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.deffered.rb1", "jthree.programs.rb1", vs, fs);
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
		this.configureProgram(object);
		geometry.drawElements(this.Renderer.ContextManager,null);
	}

	private configureProgram(object: SceneObject) {
        var geometry = object.Geometry;
        var programWrapper = this.rb1Program.getForContext(this.Renderer.ContextManager);
        programWrapper.useProgram();
        var v = object.Transformer.calculateMVPMatrix(this.Renderer);
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
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}
}
export = RB1RenderStage;