import IApplyMaterialArgument = require("../Base/IApplyMaterialArgument");
import BasicMaterial = require("../Base/BasicMaterial");
import Matrix = require("../../../Math/Matrix");
/**
 * Provides shadow map rendering materials.
 * By this material, default meshes will be rendered as shadow map.
 * These shadow map will be used in lighting stage to drop shadow.
 */
class ShadowMapMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/ShadowMap/ShadowMap.html"));
    this.setLoaded();
  }

  public apply(matArg: IApplyMaterialArgument): void {
    // const light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
    // this.materialVariables = {
    //   matL: Matrix.multiply(light.matLightViewProjection, matArg.object.Transformer.LocalToGlobal)
    // };
    super.apply(matArg);
  }
}

export = ShadowMapMaterial;
