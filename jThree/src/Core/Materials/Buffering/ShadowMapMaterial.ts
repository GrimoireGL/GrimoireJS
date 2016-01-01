import BasicMaterial = require("../Base/BasicMaterial");
import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Matrix = require("../../../Math/Matrix");
import TextureBase = require('../../Resources/Texture/TextureBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import IMaterialConfig = require("./../IMaterialConfig");
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
/**
 * Provides shadow map rendering materials.
 * By this material, default meshes will be rendered as shadow map.
 * These shadow map will be used in lighting stage to drop shadow.
 */
class ShadowMapMaterial extends BasicMaterial
{
    constructor()
    {
        super(require("../BuiltIn/ShadowMap/ShadowMap.html"));
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void
    {
      const light = scene.LightRegister.shadowDroppableLights[techniqueIndex];
      this.materialVariables={
        matL:Matrix.multiply(light.matLightViewProjection,object.Transformer.LocalToGlobal)
      };
      super.configureMaterial(scene,renderStage,object,texs,techniqueIndex,passIndex);
    }
}

export =ShadowMapMaterial;
