import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
/**
 * Provides directional light feature.
 * Parameters:
 * X:TYPE ID ,YZW:COLOR
 * XYZ:DIRECTION
 */
class AreaLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

    public getParameters(renderer:RendererBase): number[] {
        var dir = Matrix.transformNormal(renderer.Camera.ViewMatrix,this.transformer.Foward);
        var b = Matrix.transformPoint(renderer.Camera.ViewMatrix,this.basePoint);
        var r = Matrix.transformPoint(renderer.Camera.ViewMatrix,this.rightPoint);
        var t = Matrix.transformPoint(renderer.Camera.ViewMatrix,this.topPoint);
        var f = Matrix.transformPoint(renderer.Camera.ViewMatrix,this.farPoint);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            b.X,b.Y,b.Z,0,
            r.X,r.Y,r.Z,0,
            t.X,t.Y,t.Z,0,
            f.X,f.Y,f.Z];
    }

	public intensity: number = 1.0;

  public basePoint = Vector3.Zero;

  public rightPoint = Vector3.Zero;

  public farPoint = Vector3.Zero;

  public topPoint = Vector3.Zero;

	public get LightType(): string {
		return "jthree.lights.arealight";
    }

    public static get TypeDefinition(): LightTypeDeclaration
    {
        return {
            typeName: "jthree.lights.arealight",
            requiredParamCount: 5,
            shaderfuncName: "calcAreaLight",
            diffuseFragmentCode: require('../../Shaders/Light/Area/DiffuseChunk.glsl'),
            specularFragmentCode: require('../../Shaders/Light/Area/SpecularChunk.glsl')
        };
    }
}

export = AreaLight;
