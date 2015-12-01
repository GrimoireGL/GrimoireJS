import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import glm = require("gl-matrix");

/**
 * Provides area light feature.
 * Parameters:
 * X:TYPE ID ,XYZ:COLOR
 */
class SceneLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

    public getParameters(renderer:BasicRenderer): number[] {
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity];
		}

		private calcAxis(x:number,y:number,z:number,bp:Vector3)
		{
			return new Vector3(x + bp.X , y + bp.Y, -z + bp.Z);
		}

	public intensity: number = 1.0;


	public get LightType(): string {
		return "jthree.lights.scenelight";
    }

    public static get TypeDefinition(): LightTypeDeclaration
    {
        return {
            typeName: "jthree.lights.scenelight",
            requiredParamCount: 1,
            shaderfuncName: "calcSceneLight",
            diffuseFragmentCode: require('../../Shaders/Light/Scene/DiffuseChunk.glsl'),
            specularFragmentCode: require('../../Shaders/Light/Scene/SpecularChunk.glsl')
        };
    }
}

export = SceneLight;
