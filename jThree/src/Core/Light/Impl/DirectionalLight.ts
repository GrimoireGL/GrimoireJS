import Vector3 = require('../../../Math/Vector3');
import ShadowDroppableLight = require("../ShadowMap/ShadowDroppableLight");
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
/**
 * Provides directional light feature.
 * Parameters:
 * X:TYPE ID ,YZW:COLOR
 * XYZ:DIRECTION
 * X:Shadow map flag,Y:sampler index ,Z: bias
 */
class DirectionalLight extends ShadowDroppableLight {
	constructor(scene: Scene) {
		super(scene);
    }

		private directionCache:Vector3;

    public getParameters(renderer:RendererBase,shadowMapIndex?:number): number[] {
        var dir = this.directionCache = Matrix.transformNormal(renderer.Camera.ViewMatrix,this.transformer.forward);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            dir.X,dir.Y,dir.Z,0,
					this.isShadowDroppable?1:0,shadowMapIndex,this.bias];
    }

		public updateLightMatricis(renderer:RendererBase)
		{
			this.updateLightProjection(renderer,Matrix.multiply(Matrix.perspective(1.0,1,0.1,5),Matrix.lookAt(this.Transformer.Position,Vector3.add(this.Transformer.Position,this.Transformer.forward),Vector3.YUnit)));
		}

		private LiSPSM()
		{
			var smY = this.directionCache.negateThis();
			
		}

	public intensity:number;

	public bias:number = 0.001;

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
