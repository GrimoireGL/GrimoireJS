import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
import ContextManagerBase = require('../ContextManagerBase');
import Scene = require('../Scene');
import Material = require('Materials/Material');
import RendererBase = require('../Renderers/RendererBase');
import JThreeEvent = require("../../Base/JThreeEvent");
import Delegates = require("../../Base/Delegates");
class LightBase extends SceneObject
{
    protected scene: Scene;

    private parameterChanged:JThreeEvent<LightBase>=new JThreeEvent();
	
	constructor(scene:Scene)
	{
		super();
		this.scene=scene;
	}
	
	private color:Color4;
	
	public get Color():Color4
	{
		return this.color;
	}
	
	public set Color(col:Color4)
	{
		this.color=col;
	}
	
	public get Position():Vector3
	{
		return this.Transformer.Position;
	}
	
	public get AliasName():string
	{
		return null;
	}
	
	public drawBuffer(renderer:RendererBase,scene:Scene,object: SceneObject, material: Material,passCount:number) {
	}
	
	public beforeRender(target:ContextManagerBase)
	{
		
	}
	
	public afterRender(target:ContextManagerBase)
	{
		
    }

    public onParameterChanged(handler:Delegates.Action2<Object,LightBase>) {
        this.parameterChanged.addListerner(handler);
    }
	
    public getParameters(renderer:RendererBase): number[] {
        return [];
    }
}

export = LightBase;