import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
import LightBase = require('./LightBase');

class DirectionalLight extends LightBase
{
	constructor()
	{
		super();
	}
	
	private intensity:number=1.0;
	
	/**
	 * Light's intensity
	 */
	public get Intensity():number
	{
		return this.intensity;
	}
	
	/**
	 * Light's intensity
	 */
	public set Intensity(intensity:number)
	{
		this.intensity=intensity;
	}
	
	public get AliasName():string
	{
		return "jthree.lights.directionallight";
	}
}

export = DirectionalLight;