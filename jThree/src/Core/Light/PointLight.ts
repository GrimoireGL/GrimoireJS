import Scene = require('../Scene');
import LightBase = require('./LightBase');
import LightTypeDeclaration = require("LightTypeDeclaration"); /**
 * Point Light
 * Parameter order
 * 0:X:TypeID YZW:Color.RGB*Intencity
 * 1:XYZ:POSITION.XYZ W: UNUSED (0)
 * 2:X:Distance Y:Decay
 */
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
	
	public get LightType():string
	{
		return "jthree.lights.pointlight";
    }

    public getParameters(): number[]
    {
        return [this.Color.R * this.Intensity, this.Color.G * this.Intensity, this.Color.B * this.Intensity,
            this.Position.X, this.Position.Y, this.Position.Z, 0,
        this.Distance,this.Decay];
    }

    public static get TypeDefinition(): LightTypeDeclaration {
        return {
            typeName: "jthree.lights.pointlight",
            requiredParamCount: 3,
            shaderfuncName: "calcPointLight",
            diffuseFragmentCode: require('../Shaders/Light/PointLightDiffuseFragmentChunk.glsl'),
            specularFragmentCode:require("../Shaders/Light/PointLightSpecularFragmentChunk.glsl")
        };
    }
}

export = PointLight;