import RBO from "../Resources/RBO/RBO";
import TextureBase from "../Resources/Texture/TextureBase";
interface BufferInput {
  [name: string]: TextureBase | RBO;
  defaultRenderBuffer: RBO;
}

export default BufferInput;
