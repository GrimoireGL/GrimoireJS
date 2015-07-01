import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import Scene = require('../../Scene')
class RenderStageBase extends JThreeObject {
	private renderer: RendererBase;
	/**
	 * Getter for renderer having this renderstage
	 */
	public get Renderer(): RendererBase {
		return this.renderer;
	}

	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
	}
	
	public preBeginStage(scene:Scene,passCount:number)
	{
		
	}
	
	public postEndStage(scene:Scene,passCount:number)
	{
		
	}

	public render(scene:Scene,object: SceneObject, material: Material,passCount:number) {

	}

	public needRender(scene:Scene,object: SceneObject, material: Material,passCount:number): boolean {
		return false;
	}
	
	public getPassCount(scene:Scene)
	{
		return 1;
	}
}

export = RenderStageBase;