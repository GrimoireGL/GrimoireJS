import TextureBase = require("../Resources/Texture/TextureBase");
import RBO = require("../Resources/RBO/RBO");

interface FBOBindData {
  texture: TextureBase|RBO;
  target: string|number;
  isOptional?: boolean;
  type?: string;
}

export = FBOBindData;
