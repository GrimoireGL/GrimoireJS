import Vector3 = require('../../../Math/Vector3');
import ShadowDroppableLight = require("../ShadowMap/ShadowDroppableLight");
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import glm = require("gl-matrix");
import PointList = require("../../../Math/PointList");
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

		private lightMatrixCache:Matrix = Matrix.zero();

		public updateLightMatricis(renderer:RendererBase)
		{
			this.USM(renderer);
			this.updateLightProjection(renderer,this.lightMatrixCache);
		}

		private USM(renderer:RendererBase)//Uniform shadow map
		{
			var cam = renderer.Camera;
			//initialize light matrix cache with light view
			glm.mat4.lookAt(this.lightMatrixCache.rawElements,cam.Position.targetVector,Vector3.add(cam.Position,this.Transformer.forward).targetVector,Vector3.YUnit.targetVector);
			var lightSpaceFrustum = (new PointList(cam.frustumPoints));
			lightSpaceFrustum.transform(this.lightMatrixCache);
			var frustumAABBinLightSpace = lightSpaceFrustum.getBoundingBox();
			var lightProjection = Matrix.ortho(frustumAABBinLightSpace.pointLBF.X,frustumAABBinLightSpace.pointRTN.X,frustumAABBinLightSpace.pointLBF.Y,frustumAABBinLightSpace.pointRTN.Y,frustumAABBinLightSpace.pointLBF.Z,frustumAABBinLightSpace.pointRTN.Z);
			glm.mat4.mul(this.lightMatrixCache.rawElements,this.lightMatrixCache.rawElements,lightProjection.rawElements);
		}

		private LiSPSM()
		{

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
