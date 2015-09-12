import Scene = require('../../Scene');
import LightBase = require('./../LightBase');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import Matrix = require("../../../Math/Matrix");
import Vector3 = require("../../../Math/Vector3");
/**
 * Point Light
 * Parameter order
 * 0:X:TypeID YZW:Color.RGB*Intencity
 * 1:XYZ:Position
 * 2:XYZ:Direction
 * 3:X:Innner Cone,Y:Outer Cone,Z:Decay
 */
class SpotLight extends LightBase
{
	constructor(scene:Scene)
	{
		super(scene);
	}

	public distance:number=0.0;

	public intensity:number=1.0;

	public decay:number=1;

	public inner:number=0.3;

	public outer:number=0.7;

	public get LightType():string
	{
		return "jthree.lights.spotlight";
    }

    public getParameters(renderer:RendererBase): number[]
    {
			　var pos = this.Position;
			  pos = Matrix.transformPoint(renderer.Camera.ViewMatrix,pos);
				var dir = new Vector3(0,-1,0);
				dir = Matrix.transformNormal(renderer.Camera.ViewMatrix,dir);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            pos.X,pos.Y,pos.Z, 0,
						dir.X,dir.Y,dir.Z,0,
        this.distance,this.decay];
    }

    public static get TypeDefinition(): LightTypeDeclaration {
        return {
            typeName: "jthree.lights.spotlight",
            requiredParamCount: 3,
            shaderfuncName: "calcSpotLight",
            diffuseFragmentCode: require('../../Shaders/Light/Spot/DiffuseChunk.glsl'),
            specularFragmentCode:require("../../Shaders/Light/Spot/SpecularChunk.glsl")
        };
    }
}

export = SpotLight;
