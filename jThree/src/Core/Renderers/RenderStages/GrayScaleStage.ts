import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import Mesh = require('../../../Shapes/Mesh');
import Matrix = require('../../../Math/Matrix');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import agent = require('superagent');

declare function require(name: string): any;
class GrayScaleStage extends RenderStageBase {

	private program: Program;


	constructor(renderer: RendererBase) {
		super(renderer);
		var vs = require('../../Shaders/VertexShaders/PostEffectGeometries.glsl');
		agent.get("/GrayScale.glsl").end((err, res: agent.Response) => {
			this.program = this.loadProgram("jthree.shaders.vertex.post", "jthree.shaders.fragment.post.gray", "jthree.programs.post.gray", vs, res.text);
		});
	}


	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.DefaultFBO, [{
			texture: texs["OUT"],
			target: 0, isOptional: false
		}, {
				texture: this.DefaultRBO,
				type: "rbo",
				target: "depth"
			}], () => {
				this.Renderer.GLContext.ClearColor(0, 0, 0, 1);
				this.Renderer.GLContext.Clear(ClearTargetType.ColorBits);
			});
		this.Renderer.GLContext.Clear(ClearTargetType.DepthBits);
	}


	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry || !this.program) return;
		this.configureMaterial(scene, this.Renderer, new Mesh(geometry, null), texs);
		geometry.drawElements(this.Renderer.ContextManager,null);
		//this.rbLightFBO.getForContext(this.Renderer.ContextManager).unbind();
	}

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
		var geometry = object.Geometry;
		var programWrapper = this.program.getForContext(renderer.ContextManager);
		programWrapper.useProgram();
		var ip = Matrix.inverse(renderer.Camera.ProjectionMatrix);
		programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
		programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
		programWrapper.registerTexture(renderer, texs["SOURCE"], 0, "source");
		geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return true;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}


	public get TargetGeometry(): string {
		return "quad";
	}

	public get RenderStageConfig() {
		return {
			depthTest: true
		};
	}
}
export = GrayScaleStage;