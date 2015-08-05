import Scene = require('../Scene');
import LightBase = require('./LightBase');

class PointLight extends LightBase
{
	constructor(scene:Scene)
	{
		super(scene);
	}

	private distance:number=0.0;
	
	/**
	 * The distance of the light where the intensity is 0. When distance is 0, then the distance is endless. 
	 */
	public get Distance():number
	{
		return this.distance;
	}
	
	/**
	 * The distance of the light where the intensity is 0. When distance is 0, then the distance is endless. 
	 */
	public set Distance(num:number)
	{
		this.distance=num;
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
	
	private decay:number=1;
	
	public get Decay():number
	{
		return this.decay;
	}
	
	public set Decay(d:number)
	{
		this.decay=d;
	}
	
	public get AliasName():string
	{
		return "jthree.lights.pointlight";
	}
}

export = PointLight;