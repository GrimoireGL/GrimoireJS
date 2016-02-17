import IRenderBufferBindingConfig from "./IRenderBufferBindingConfig";
import IColorBufferBindingConfig from "./IColorBufferBindingConfig";
interface IFBOBindingConfig {
  [colorIndex: number]: IColorBufferBindingConfig;
  rbo?: IRenderBufferBindingConfig;
  primaryIndex?: number;
  primaryName?: string;
}
export default IFBOBindingConfig;
