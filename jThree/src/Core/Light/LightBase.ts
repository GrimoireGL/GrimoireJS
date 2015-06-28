import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
class LightBase extends SceneObject
{
	constructor(color:Color4,pos:Vector3)
	{
		super();
		this.color=color;
		this.Transformer.Position=pos;
	}
	
	private color:Color4;
	
	public get Color():Color4
	{
		return this.color;
	}
	
	public get Position():Vector3
	{
		return this.Transformer.Position;
	}
}

export = LightBase;