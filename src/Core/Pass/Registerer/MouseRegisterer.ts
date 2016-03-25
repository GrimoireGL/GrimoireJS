import CanvasRegion from "../../Canvas/CanvasRegion";
import Vector2 from "../../../Math/Vector2";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import RegistererBase from "./RegistererBase";
class MouseRegisterer extends RegistererBase {
  public getName(): string {
    return "builtin.mouse";
  }

  public register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }): void {
    if (uniforms["_mousePosition"]) {
     const hittableRegion = <CanvasRegion><any>matArg.renderer;
      pWrapper.uniformVector("_mousePosition", new Vector2(hittableRegion.mouseX, hittableRegion.mouseY));
    }
  }
}

export default MouseRegisterer;
