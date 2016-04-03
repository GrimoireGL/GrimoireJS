import Vector2 from "../../../Math/Vector2";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import Matrix from "../../../Math/Matrix";
import RegistererBase from "./RegistererBase";
class BasicRegisterer extends RegistererBase {
  public getName(): string {
    return "builtin.basic";
  }

  public register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }): void {
    if (uniforms["_matM"]) {
      pWrapper.uniformMatrix("_matM", matArg.object.Transformer.localToGlobal);
    }
    if (uniforms["_matV"]) {
      pWrapper.uniformMatrix("_matV", matArg.renderStage.renderer.camera.viewMatrix);
    }
    if (uniforms["_matP"]) {
      pWrapper.uniformMatrix("_matP", matArg.renderStage.renderer.camera.projectionMatrix);
    }
    if (uniforms["_matVM"]) {
      pWrapper.uniformMatrix("_matVM", Matrix.multiply(matArg.renderStage.renderer.camera.viewMatrix, matArg.object.Transformer.localToGlobal));
    }
    if (uniforms["_matPV"]) {
      pWrapper.uniformMatrix("_matPV", matArg.renderStage.renderer.camera.viewProjectionMatrix);
    }
    if (uniforms["_matPVM"]) {
      pWrapper.uniformMatrix("_matPVM", matArg.object.Transformer.calculateMVPMatrix(matArg.renderStage.renderer));
    }
    if (uniforms["_matIP"]) {
      pWrapper.uniformMatrix("_matIP", matArg.renderStage.renderer.camera.invProjectionMatrix);
    }
    if (uniforms["_eyePosition"]) {
      pWrapper.uniformVector("_eyePosition", matArg.renderStage.renderer.camera.Transformer.GlobalPosition);
    }
    if (uniforms["_farClip"]) {
      pWrapper.uniformFloat("_farClip", matArg.renderStage.renderer.camera.Far);
    }
    if (uniforms["_nearClip"]) {
      pWrapper.uniformFloat("_nearClip", matArg.renderStage.renderer.camera.Near);
    }
    if (uniforms["_resolution"]) {
      const region = matArg.renderStage.renderer.region;
      pWrapper.uniformVector("_resolution", new Vector2(region.Width, region.Height));
    }
  }
}
export default BasicRegisterer;
