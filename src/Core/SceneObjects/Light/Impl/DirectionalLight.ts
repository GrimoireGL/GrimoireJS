import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import LightBase from "../LightBase";
import BasicMaterial from "../../../Materials/BasicMaterial";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import Vector3 from "../../../../Math/Vector3";
import Matrix from "../../../../Math/Matrix";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";

/**
 * Provides directional light feature.
 */
class DirectionalLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("quad");
    const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/DirectionalLight.xmml"));
    diffuseMaterial.on("apply", (matArg: IApplyMaterialArgument) => {
      diffuseMaterial.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        lightDirection: Vector3.normalize(Matrix.transformNormal(matArg.camera.viewMatrix, this.__transformer.forward))
      };
    });
    const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/DirectionalLight.xmml"));
    specularMaterial.on("apply", (matArg: IApplyMaterialArgument) => {
      specularMaterial.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        lightDirection: Vector3.normalize(Matrix.transformNormal(matArg.camera.viewMatrix, this.__transformer.forward))
      };
    });
    this.addMaterial(diffuseMaterial);
    this.addMaterial(specularMaterial);
  }


  // public getParameters(renderer: BasicRenderer, shadowMapIndex?: number): number[] {
  //   var dir = Vector3.normalize(Matrix.transformNormal(renderer.Camera.viewMatrix, this.transformer.forward));
		// 		var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
		// 		debug.setInfo("lDir", dir.toString());
  //   return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
  //     dir.X, dir.Y, dir.Z, 0,
  //     this.isShadowDroppable ? 1 : 0, shadowMapIndex, this.bias];
  // }
  //
		// private shadowProjectionMatrixCache: Matrix = Matrix.zero();
  //
		// private shadowViewMatrixCache: Matrix = Matrix.zero();
  //
		// private shadowMatrixCache: Matrix = Matrix.zero();
  //
		// private nearClip: number = 0.1;
  //
  // /**
  //  * Calculate up vector of light view.
  //  */
		// private computeUpVector(viewDir: Vector3, lightDir: Vector3): Vector3 {
  //   var left = Vector3.cross(lightDir, viewDir);
  //   var up = Vector3.cross(left, lightDir);
  //   return up;
		// }
  //
		// private computePerspective(n: number, f: number) {
  //   var m = Matrix.identity();
  //   m.rawElements[5] = (f + n) / (f - n);		// [ 1 0 0 0]
  //   m.rawElements[13] = -2 * f * n / (f - n);		// [ 0 a 0 b]
  //   m.rawElements[7] = 1;				// [ 0 0 1 0]
  //   m.rawElements[15] = 0;
  //   return m;
		// }
  //
		// public updateLightMatricis(renderer: BasicRenderer) {
  //   //cam.Transformer.forward -> viewDirection
  //   //this.Transformer.forward -> lightDirection
  //   var cam: Camera = renderer.Camera;
  //   this.generateLightviewMatrix(renderer.Camera);
  //   this.USM(renderer);
  //   //this.updateLightProjection(renderer,Matrix.ortho(-10,10,-10,10,0.1,30),Matrix.lookAt(new Vector3(0,0,20),new Vector3(0,0,0),new Vector3(0,1,0)));
  //   glm.mat4.mul(this.shadowMatrixCache.rawElements, Matrix.scale(new Vector3(1, 1, -1)).rawElements, this.shadowMatrixCache.rawElements);
		// 	 this.updateLightProjection(renderer, this.shadowMatrixCache);
		// }
  //
		// private LiSPSM(renderer: BasicRenderer) {
  //   var cam = renderer.Camera;
  //   var viewDirection = cam.Transformer.forward;
  //   var lightDirection = this.transformer.forward;
  //   var eyePosition = cam.Transformer.GlobalPosition;
  //   var angle: number = Vector3.angle(viewDirection, lightDirection);
  //   //check whether needs USM or LiSPSM here.
  //   if (angle == 0 || angle == Math.PI) {
  //     this.USM(renderer);
  //     return;
  //   }
  //   var sinGamma: number = Math.abs(Math.sin(angle));
  //
  //   //Computing light view matrix
  //   var up: Vector3 = this.computeUpVector(viewDirection, lightDirection);
  //   var lv: Matrix = Matrix.lookAt(eyePosition, Vector3.add(eyePosition, lightDirection), up);
  //
  //   //Compute AABB of camera frusutum in light view space
  //   var pl = new PointList(cam.frustumPoints);
  //   pl.transform(lv);
  //   var vfAABB = pl.getBoundingBox();
  //   //Compute new frustum
  //   var factor = 1 / sinGamma;
  //   var z_n = this.nearClip * factor;
  //   var d = Math.abs(vfAABB.pointRTN.Y - vfAABB.pointLBF.Y);
  //   var z_f = z_n * d * sinGamma;
  //   var n = (z_n + Math.sqrt(z_f * z_n)) / sinGamma;
  //   var f = n + d;
  //   //Compute new light view
  //   var newPos = eyePosition.subtractWith(up.multiplyWith(n - this.nearClip));
  //   lv = Matrix.lookAt(newPos, Vector3.add(newPos, lightDirection), up);
  //   var lp = this.computePerspective(n, f);
  //   //Compute light matrix
  //   var lVP = Matrix.multiply(lp, this.shadowViewMatrixCache);
  //
  //   var pl2 = new PointList(cam.frustumPoints);
  //   pl2.transform(lVP);
  //   var unitAABB = pl2.getBoundingBox();
  //   var unitCube = this.generateUnitCubeMatrix(unitAABB);
  //   glm.mat4.mul(this.shadowMatrixCache.rawElements, unitCube.rawElements, lp.rawElements);
		// }
  //
		// private generateLightviewMatrix(cam: Camera) {
  //   glm.mat4.lookAt(this.shadowViewMatrixCache.rawElements, cam.Transformer.GlobalPosition.rawElements, Vector3.add(cam.Transformer.GlobalPosition, this.transformer.forward).rawElements, Vector3.YUnit.rawElements);
		// }
  //
		// private USM(renderer: BasicRenderer)//Uniform shadow map
		// {
  //   var cam = renderer.Camera;
  //   //initialize light matrix cache with light view
  //   var lightSpaceFrustum = (new PointList(cam.frustumPoints));
  //   lightSpaceFrustum.transform(this.shadowViewMatrixCache);
  //   var frustumAABBinLightSpace = lightSpaceFrustum.getBoundingBox();
  //   var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
  //   debug.setInfo("RTN", frustumAABBinLightSpace.pointRTN.toString());
  //   debug.setInfo("LBF", frustumAABBinLightSpace.pointLBF.toString());
  //   this.shadowProjectionMatrixCache = this.generateUnitCubeMatrix(frustumAABBinLightSpace);
  //   glm.mat4.mul(this.shadowMatrixCache.rawElements, this.shadowProjectionMatrixCache.rawElements, this.shadowViewMatrixCache.rawElements);
		// }
  //
		// private generateUnitCubeMatrix(align: AABB) {
  //   /*
  //     result._11 = 2.0f / ( max.x - min.x );
  //     result._21 = 0.0f;
  //     result._31 = 0.0f;
  //     result._41 = -( max.x + min.x ) / ( max.x - min.x );
  //
  //     result._12 = 0.0f;
  //     result._22 = 2.0f / ( max.y - min.y );
  //     result._32 = 0.0f;
  //     result._42 = -( max.y + min.y ) / ( max.y - min.y );
  //
  //     result._13 = 0.0f;
  //     result._23 = 0.0f;
  //     result._33 = 1.0f / ( max.z - min.z );
  //     result._43 = - min.z / ( max.z - min.z );
  //
  //     result._14 = 0.0f;
  //     result._24 = 0.0f;
  //     result._34 = 0.0f;
  //     result._44 = 1.0f;
  //    */
  //   //return Matrix.ortho(align.pointLBF.X,align.pointRTN.X,align.pointLBF.Y,align.pointRTN.Y,align.pointRTN.Z,align.pointLBF.Z);
  //   return Matrix.fromElements(
  //     2.0 / (align.pointRTN.X - align.pointLBF.X), 0, 0, -(align.pointRTN.X + align.pointLBF.X) / (align.pointRTN.X - align.pointLBF.X),
  //     0, 2.0 / (align.pointRTN.Y - align.pointLBF.Y), 0, -(align.pointRTN.Y + align.pointLBF.Y) / (align.pointRTN.Y - align.pointLBF.Y),
  //     0, 0, 2.0 / (align.pointRTN.Z - align.pointLBF.Z), (align.pointRTN.Z + align.pointLBF.Z) / (align.pointLBF.Z - align.pointRTN.Z),
  //     0, 0, 0, 1.0
  //     );
		// }

  public intensity: number;

  public bias: number = 0.2;
}

export default DirectionalLight;
