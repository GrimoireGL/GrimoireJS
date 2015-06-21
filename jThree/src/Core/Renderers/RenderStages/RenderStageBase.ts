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
	
	public preBeginStage()
	{
		
	}
	
	public postEndStage()
	{
		
	}

	public render(object: SceneObject, material: Material) {

	}

	public needRender(object: SceneObject, material: Material): boolean {
		return false;
	}
}

export = RenderStageBase;