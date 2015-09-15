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
 * 1:XYZ:POSITION.XYZ W: UNUSED (0)
 * 2:X:Distance Y:Decay
 */
class PointLight extends LightBase
{
	constructor(scene:Scene)
	{
		super(scene);
	}

	public distance:number=0.0;

	public intensity:number=1.0;

	public decay:number=1;

	public get LightType():string
	{
		return "jthree.lights.pointlight";
    }

    public getParameters(renderer:RendererBase): number[]
    {
			　var pos = this.Position;
			  pos = Matrix.transformPoint(renderer.Camera.ViewMatrix,pos);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            pos.X,pos.Y,pos.Z, 0,
        this.distance,this.decay];
    }

    public static get TypeDefinition(): LightTypeDeclaration {
        return {
            typeName: "jthree.lights.pointlight",
            requiredParamCount: 3,
            shaderfuncName: "calcPointLight",
            diffuseFragmentCode: require('../../Shaders/Light/Point/DiffuseChunk.glsl'),
            specularFragmentCode:require("../../Shaders/Light/Point/SpecularChunk.glsl")
        };
    }
}

export = PointLight;
