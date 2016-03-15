import RegistererBase from "./RegistererBase";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";
class StageDescriptionRegisterer extends RegistererBase {
  public getName(): string {
    return "builtin.stageInfo";
  }

  public register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }): void {
    if (uniforms["_techniqueIndex"]) {
      pWrapper.uniformInt("_techniqueIndex", matArg.techniqueIndex);
    }
    if (uniforms["_passIndex"]) {
      pWrapper.uniformInt("_passIndex", matArg.passIndex);
    }
    if (uniforms["_techniqueCount"]) {
      pWrapper.uniformInt("_techniqueCount", matArg.techniqueCount);
    }
    if (uniforms["_passCount"]) {
      pWrapper.uniformInt("_passCount", matArg.passCount);
    }
  }
}

export default StageDescriptionRegisterer;
