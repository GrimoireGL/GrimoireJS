import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
class PointLight extends JThreeObject
{
	constructor(color:Color4,pos:Vector3)
	{
		super();
		this.color=color;
		this.position=pos;
	}
	private color:Color4;
	private position:Vector3;
	
	public get Color():Color4
	{
		return this.color;
	}
	
	public get Position():Vector3
	{
		return this.position;
	}
}

export = PointLight;