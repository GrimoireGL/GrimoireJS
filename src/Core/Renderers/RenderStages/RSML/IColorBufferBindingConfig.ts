import Vector4 from "../../../../Math/Vector4";
interface IColorBufferBindingConfig {
  registerIndex: number;
  name: string;
  needClear: boolean;
  clearColor: Vector4;
}
export default IColorBufferBindingConfig;
