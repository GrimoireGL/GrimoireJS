import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import glm = require("gl-matrix");

/**
 * Provides area light feature.
 * Parameters:
 * X:TYPE ID ,XYZ:COLOR
 * XYZ:BASE VECTOR W:NON USED
 * XYZ:Mat3[0-2]
 * XYZ:Mat3[3-5] The matrix "M"
 * XYZ:Mat3[6-8]
 * B: base vector
 * R: right vector
 * T: top vector
 * F: far vector
 *
 * For area light test, find k,l,m for arbitary vector V
 * (V-B)=(R-B)k+(T-B)l+(F-B)m
 * If k,l,m ∈ [0,1]　→　the position vector V is inside of range of area light.
 * The matrix M fulfill the rule below.
 * M(V-B) = (k,l,m)^t
 * t is transpose mark.
 */
class AreaLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

    public getParameters(renderer:RendererBase): number[] {
        var dir = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.forward);
				var vm = Matrix.multiply(renderer.Camera.viewMatrix,this.transformer.LocalToGlobal);
        var b = Matrix.transformPoint(vm,Vector3.Zero);
				var bp = Matrix.transformPoint(this.transformer.LocalToGlobal,Vector3.Zero);
        var r = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.right.multiplyWith(this.rightLength));
        var t = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.up.multiplyWith(this.topLength));
        var f = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.forward.multiplyWith(this.farLength));
        var factor =[r.X,r.Y,r.Z,t.X,t.Y,t.Z,f.X,f.Y,f.Z];
        glm.mat3.invert(factor,factor);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            b.X,b.Y,b.Z,0,
            factor[0],factor[1],factor[2],0,
            factor[3],factor[4],factor[5],0,
            factor[6],factor[7],factor[8]];
    }

		private calcAxis(x:number,y:number,z:number,bp:Vector3)
		{
			return new Vector3(x + bp.X , y + bp.Y, -z + bp.Z);
		}

	public intensity: number = 1.0;

  public rightLength:number =1;

  public farLength:number =1;

  public topLength:number = 1;

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
