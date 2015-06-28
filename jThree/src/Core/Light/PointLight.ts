import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
import LightBase = require('./LightBase');
class PointLight extends LightBase
{
	constructor(color:Color4,pos:Vector3)
	{
		super(color,pos);
	}

}

export = PointLight;