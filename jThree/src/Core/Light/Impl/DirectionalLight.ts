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

		private directionInViewSpace:Vector3;

    public getParameters(renderer:RendererBase,shadowMapIndex?:number): number[] {
        var dir = this.directionInViewSpace = Matrix.transformNormal(renderer.Camera.viewMatrix,this.transformer.forward);
        return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
            dir.X,dir.Y,dir.Z,0,
					this.isShadowDroppable?1:0,shadowMapIndex,this.bias];
    }

		private shadowProjectionMatrixCache:Matrix = Matrix.zero();

		private shadowViewMatrixCache:Matrix = Matrix.zero();

		private nearClip:number = 0.1;

		/**
		 * Calculate up vector of light view.
		 */
		private computeUpVector(viewDir:Vector3,lightDir:Vector3):Vector3
		{
			var left = Vector3.cross(lightDir,viewDir);
			var up = Vector3.cross(left,lightDir);
			return up;
		}

		private computePerspective(n:number,f:number)
		{
			var m = Matrix.identity();
			m.setAt(1,1,f/(f-n));
			m.setAt(3,1,1);
			m.setAt(1,3,-2*f*n/(f-n));
			m.setAt(3,3,0);
			return m;
		}

		public updateLightMatricis(renderer:RendererBase)
		{
			//cam.Transformer.forward -> viewDirection
			//this.Transformer.forward -> lightDirection
			var cam:Camera = renderer.Camera;
			this.generateLightviewMatrix(renderer.Camera);
			this.USM(renderer);
		  //glm.mat4.multiply(this.lightMatrixCache.rawElements,this.lightMatrixCache.rawElements,Matrix.scale(new Vector3(1,1,-1)).rawElements);
			this.updateLightProjection(renderer,Matrix.multiply(Matrix.perspective(1.0,1,0.1,30),Matrix.lookAt(this.Transformer.Position,Vector3.add(this.Transformer.Position,this.Transformer.forward),Vector3.YUnit)));
			// var m = Matrix.multiply(this.shadowProjectionMatrixCache,this.shadowViewMatrixCache);
			// this.updateLightProjection(renderer,m);
		}

		private LiSPSM(renderer:RendererBase)
		{
			var cam = renderer.Camera;
			var angle:number = Vector3.angle(cam.Transformer.forward,this.transformer.forward);
			//check whether needs USM or LiSPSM here.
			if(angle == 0 || angle == Math.PI)
			{
				this.USM(renderer);
				return;
			}
			var sinGamma:number = Math.abs(Math.sin(angle));

			//Computing light view matrix
			var up:Vector3 = this.computeUpVector(cam.Transformer.forward	,this.Transformer.forward);
			var lv:Matrix = Matrix.lookAt(cam.Transformer.GlobalPosition,Vector3.add(cam.Transformer.GlobalPosition,this.Transformer.forward),up);

			//Compute AABB of camera frusutum in light view space
			var pl = new PointList(cam.frustumPoints);
			pl.transform(lv);
			var vfAABB = pl.getBoundingBox();
			//Compute new frustum
			var factor = 1 / sinGamma;
			var n_z = this.nearClip * factor;
			var d = Math.abs(vfAABB.pointRTN.Z - vfAABB.pointLBF.Z);
			var n = d /(Math.sqrt((n_z + d * sinGamma)/n_z)-1);
			var f = n + d;

			//Compute new light view
			var newPos = cam.Transformer.GlobalPosition.subtractWith(up.multiplyWith(n - this.nearClip));
			lv = Matrix.lookAt(newPos,Vector3.add(newPos,this.Transformer.forward),up);
			var lp = this.computePerspective(n,f);
			//Compute light matrix
			var lVP = Matrix.multiply(lp,this.shadowViewMatrixCache);

			pl = new PointList(cam.frustumPoints);
			pl.transform(lVP);
			var unitAABB = pl.getBoundingBox();
			var unitCube = this.generateUnitCubeMatrix(unitAABB);
			glm.mat4.mul(this.shadowProjectionMatrixCache.rawElements,unitCube.rawElements,lp.rawElements);
		}

		private generateLightviewMatrix(cam:Camera)
		{
			glm.mat4.lookAt(this.shadowViewMatrixCache.rawElements,cam.Transformer.GlobalPosition.rawElements,Vector3.add(cam.Transformer.GlobalPosition,this.transformer.forward).rawElements,Vector3.YUnit.rawElements);
		}

		private USM(renderer:RendererBase)//Uniform shadow map
		{
			var cam = renderer.Camera;
			//initialize light matrix cache with light view
			var lightSpaceFrustum = (new PointList(cam.frustumPoints));
			lightSpaceFrustum.transform(this.shadowViewMatrixCache);
			var frustumAABBinLightSpace = lightSpaceFrustum.getBoundingBox();
			this.shadowProjectionMatrixCache = this.generateUnitCubeMatrix(frustumAABBinLightSpace);
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
				2.0/(align.pointRTN.X-align.pointLBF.X), 0, 0, -(align.pointRTN.X + align.pointLBF.X)/(align.pointRTN.X-align.pointLBF.X),
				0,2.0/(align.pointRTN.Y - align.pointLBF.Y),0,-(align.pointRTN.Y + align.pointLBF.Y)/(align.pointRTN.Y-align.pointLBF.Y),
				0,0,2.0/(align.pointRTN.Z - align.pointLBF.Z),-(align.pointLBF.Z+align.pointRTN.Z)/(align.pointRTN.Z-align.pointLBF.Z),
				0,0,0,1.0
			);
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
