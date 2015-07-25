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
declare function require(target: string): any;
class RBDepthStage extends RenderStageBase {

	private rbDepthProgram: Program;

	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var vs = require('../../Shaders/VertexShaders/DepthGeometries.glsl');
        var fs = require('../../Shaders/Depth/Depth.glsl');
        this.rbDepthProgram = this.loadProgram("jthree.shaders.vertex.depth", "jthree.shaders.fragment.depth", "jthree.programs.depth", vs, fs);
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
		mats[0].configureMaterial(scene,this.Renderer,object,null);
		geometry.drawElements(this.Renderer.ContextManager,null);
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return typeof object.Geometry!="undefined"&&object.Geometry!=null;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}

}
export = RBDepthStage;