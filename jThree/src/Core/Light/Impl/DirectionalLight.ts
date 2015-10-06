import Vector3 = require('../../../Math/Vector3');
import ShadowDroppableLight = require("../ShadowMap/ShadowDroppableLight");
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import glm = require("gl-matrix");
import PointList = require("../../../Math/PointList");
import Camera = require("../../Camera/Camera");
import AABB = require("../../../Math/AABB");
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
        var dir = this.directionCache = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.forward);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            dir.X,dir.Y,dir.Z,0,
					this.isShadowDroppable?1:0,shadowMapIndex,this.bias];
    }

		private lightMatrixCache:Matrix = Matrix.zero();

		public updateLightMatricis(renderer:RendererBase)
		{
			//this.generateLightviewMatrix(this.lightMatrixCache,renderer.Camera);
			//this.USM(renderer);
			this.updateLightProjection(renderer,Matrix.multiply(Matrix.perspective(1.0,1,0.1,5),Matrix.lookAt(this.Transformer.Position,Vector3.add(this.Transformer.Position,this.Transformer.forward),Vector3.YUnit)));
			//this.updateLightProjection(renderer,this.lightMatrixCache);
		}

		private generateLightviewMatrix(mat:Matrix,cam:Camera)
		{
			glm.mat4.lookAt(mat.rawElements,cam.Transformer.GlobalPosition.rawElements,Vector3.add(cam.Transformer.GlobalPosition,this.transformer.forward).rawElements,Vector3.YUnit.rawElements);
		}

		private USM(renderer:RendererBase)//Uniform shadow map
		{
			var cam = renderer.Camera;
			//initialize light matrix cache with light view
			var lightSpaceFrustum = (new PointList(cam.frustumPoints));
			lightSpaceFrustum.transform(this.lightMatrixCache);
			var frustumAABBinLightSpace = lightSpaceFrustum.getBoundingBox();
			var lightProjection = this.generateUnitCubeMatrix(frustumAABBinLightSpace);
			glm.mat4.mul(this.lightMatrixCache.rawElements,this.lightMatrixCache.rawElements,lightProjection.rawElements);
		}

		private generateUnitCubeMatrix(align:AABB)
		{
			/*
				result._11 = 2.0f / ( max.x - min.x );
				result._21 = 0.0f;
				result._31 = 0.0f;
				result._41 = -( max.x + min.x ) / ( max.x - min.x );

				result._12 = 0.0f;
				result._22 = 2.0f / ( max.y - min.y );
				result._32 = 0.0f;
				result._42 = -( max.y + min.y ) / ( max.y - min.y );

				result._13 = 0.0f;
				result._23 = 0.0f;
				result._33 = 1.0f / ( max.z - min.z );
				result._43 = - min.z / ( max.z - min.z );

				result._14 = 0.0f;
				result._24 = 0.0f;
				result._34 = 0.0f;
				result._44 = 1.0f;
			 */
			return Matrix.fromElements(
				2.0/(align.pointRTN.X-align.pointLBF.X), 0, 0, 0,
				0,2.0/(align.pointRTN.Y - align.pointLBF.Y),0,0,
				0,0,1.0/(align.pointRTN.Z - align.pointLBF.Z),0,
				-(align.pointRTN.X + align.pointLBF.X)/(align.pointRTN.X-align.pointLBF.X),-(align.pointRTN.Y + align.pointLBF.Y)/(align.pointRTN.Y-align.pointLBF.Y),-align.pointLBF.Z/(align.pointRTN.Z-align.pointLBF.Z),1.0
			);
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
