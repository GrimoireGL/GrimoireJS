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
class DirectionalLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

    public getParameters(renderer:RendererBase): number[] {
        var dir = Matrix.transformNormal(renderer.Camera.ViewMatrix,this.transformer.forward);
        return [this.Color.R * this.Intensity, this.Color.G * this.Intensity, this.Color.B * this.Intensity,
            dir.X,dir.Y,dir.Z];
    }

	private intensity: number = 1.0;

	private vp: Matrix;

	public get VP(): Matrix {
		return this.vp;
	}

	/**
	 * Light's intensity
	 */
	public get Intensity(): number {
		return this.intensity;
	}

	/**
	 * Light's intensity
	 */
	public set Intensity(intensity: number) {
		this.intensity = intensity;
	}

	public get LightType(): string {
		return "jthree.lights.directionallight";
    }

    public static get TypeDefinition(): LightTypeDeclaration
    {
        return {
            typeName: "jthree.lights.directionallight",
            requiredParamCount: 3,
            shaderfuncName: "calcDirectionalLight",
            diffuseFragmentCode: require('../../Shaders/Light/Directional/DiffuseChunk.glsl'),
            specularFragmentCode: require('../../Shaders/Light/Directional/SpecularChunk.glsl')
        };
    }
}

export = DirectionalLight;
