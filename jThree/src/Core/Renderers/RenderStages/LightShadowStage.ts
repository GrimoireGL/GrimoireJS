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
import Mesh=require('../../../Shapes/Mesh');
import RBO = require('../../Resources/RBO/RBO');
class LightShadowStage extends RenderStageBase
{
	
	constructor(renderer:RendererBase)
	{
		super(renderer);
	}
	
	
	public preBeginStage(scene:Scene,passCount:number)
	{
		scene.getLightByIndex(passCount).beforeRender(this.Renderer.ContextManager);
	}
	
	public postEndStage(scene:Scene,passCount:number)
	{
		scene.getLightByIndex(passCount).afterRender(this.Renderer.ContextManager);
	}
	
	public render(scene:Scene,object: SceneObject, material: Material,passCount:number) {
		scene.getLightByIndex(passCount).drawBuffer(this.Renderer,scene,object,material,passCount);
	}

	public needRender(scene:Scene,object: SceneObject, material: Material,passCount:number): boolean {
		return true;
	}
	
	public getPassCount(scene:Scene)
	{
		return scene.LightCount;
	}
}
export = LightShadowStage;