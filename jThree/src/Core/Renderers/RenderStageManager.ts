import RendererBase = require('./RendererBase');
import RenderStageBase = require('./RenderStages/RenderStageBase');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import RenderStageChain = require('./RenderStageChain');
import TextureWrapperBase = require('./../Resources/Texture/TextureWrapperBase');
import JThreeContextProxy = require('./../JThreeContextProxy');
import SceneObject = require('../SceneObject');
import Mesh =require('../../Shapes/Mesh')
import Scene = require('../Scene');
import QuadGeometry = require('../Geometries/QuadGeometry');
import ResolvedChainInfo = require('./ResolvedChainInfo');
class RenderStageManager
{
	private parentRenderer:RendererBase;
	private defaultQuad:QuadGeometry;
	
	constructor(parent:RendererBase)
	{
		this.parentRenderer=parent;
		this.defaultQuad=new QuadGeometry("jthree.renderstage.default.quad");
	}
	
	private stageChains:RenderStageChain[]=[];
	
	private genChainTexture(chain:RenderStageChain):ResolvedChainInfo
	{
		var texInfo:ResolvedChainInfo={};
		var context=JThreeContextProxy.getJThreeContext();
		for(var targetName in chain.buffers)
		{
			var bufferName=chain.buffers[targetName];
			if(bufferName=='default'){
				texInfo[targetName]=null;//default buffer
				continue;
			}
			var tex=context.ResourceManager.getTexture(this.parentRenderer.ID+"."+bufferName);
			texInfo[targetName]=tex;
		}
		return texInfo;
	}
	
	public get StageChains():RenderStageChain[]
	{
		return this.stageChains;
	}
	
	public processRender(scene:Scene,sceneObjects:SceneObject[])
	{
		this.stageChains.forEach(chain=>{
			var texs=this.genChainTexture(chain);
			var stage=chain.stage;
			var passCount=stage.getPassCount(scene);
			var targetObjects:SceneObject[];
			switch(stage.TargetGeometry)
			{
				case "quad":
				targetObjects=[new Mesh(this.defaultQuad,null)];
					break;
				case "scene":
				default:
				targetObjects=sceneObjects;
			}
			for(var i=0;i<passCount;i++)
			{
				stage.preBeginStage(scene,i,texs);
				targetObjects.forEach(v=>{
					if(stage.needRender(scene,v,i))stage.render(scene,v,i,texs);
				});
				stage.postEndStage(scene,i,texs);
			}
		});
	}
}

export=RenderStageManager;