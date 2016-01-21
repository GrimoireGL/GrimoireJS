import Vector4 = require("../../../../Math/Vector4");
interface IColorBufferBindingConfig {
  registerIndex: number;
  name: string;
  needClear: boolean;
  clearColor: Vector4;
}
export = IColorBufferBindingConfig;
