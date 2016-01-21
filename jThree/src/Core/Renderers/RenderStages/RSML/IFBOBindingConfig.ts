import IRenderBufferBindingConfig = require("./IRenderBufferBindingConfig");
import IColorBufferBindingConfig = require("./IColorBufferBindingConfig");
interface IFBOBindingConfig {
  [colorIndex: number]: IColorBufferBindingConfig;
  rbo?: IRenderBufferBindingConfig;
  primaryIndex?: number;
  primaryName?: string;
}
export = IFBOBindingConfig;
