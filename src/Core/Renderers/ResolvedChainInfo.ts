import RBO from "../Resources/RBO/RBO";
import TextureBase from "../Resources/Texture/TextureBase";
interface ResolvedChainInfo {
  [name: string]: TextureBase | RBO;
}

export default ResolvedChainInfo;
