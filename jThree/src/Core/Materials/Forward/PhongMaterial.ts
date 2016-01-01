import BasicMaterial = require("../Base/BasicMaterial");
import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Matrix = require("../../../Math/Matrix");
import Color4 = require("../../../Base/Color/Color4");
import Color3 = require('../../../Base/Color/Color3');
import TextureBase = require('../../Resources/Texture/TextureBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class PhongMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/Materials/Phong.html"));
    this.setLoaded();
  }
}

export =PhongMaterial;
