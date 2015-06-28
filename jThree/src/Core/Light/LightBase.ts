import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
class LightBase extends SceneObject
{
	constructor()
	{
		super();
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
}

export = LightBase;