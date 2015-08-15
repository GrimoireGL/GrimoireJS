import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import JThreeContextProxy = require('../../JThreeContextProxy');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import Matrix = require('../../../Math/Matrix');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class RB2RenderStage extends RenderStageBase {

	private rb2Program: Program;

	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../../Shaders/Deffered/RB2.glsl');
        this.rb2Program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.deffered.rb2", "jthree.programs.rb2", vs, fs);
	}


	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [
			{
				texture: texs["OUT"],
				target: 0
			},
			{
				texture: texs["DEPTH"],
				target: "depth"
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
        var programWrapper = this.rb2Program.getForContext(this.Renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(this.Renderer);
	    programWrapper.register({
	        attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matMV: { type: "matrix", value: Matrix.multiply(this.Renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                matV: { type: "matrix", value: this.Renderer.Camera.ViewMatrix },
            }
	    });
        geometry.IndexBuffer.getForRenderer(this.Renderer.ContextManager).bindBuffer();
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}

}
export = RB2RenderStage;