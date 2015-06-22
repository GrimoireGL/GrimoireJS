import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
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
	
	public preBeginStage(passCount:number)
	{
		
	}
	
	public postEndStage(passCount:number)
	{
		
	}

	public render(object: SceneObject, material: Material,passCount:number) {

	}

	public needRender(object: SceneObject, material: Material,passCount:number): boolean {
		return false;
	}
	
	public get PassCount():number
	{
		return 1;
	}
}

export = RenderStageBase;