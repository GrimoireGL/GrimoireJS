import Vector2 = require("../../../../Math/Vector2");
import Matrix = require("../../../../Math/Matrix");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableDescription = require("../IVariableDescription");
import IApplyMaterialArgument = require("../IApplyMaterialArgument");
const BasicMatrixRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }) => {
  if (uniforms["_matM"]) {
    pWrapper.uniformMatrix("_matM", matArg.object.Transformer.LocalToGlobal);
  }
  if (uniforms["_matV"]) {
    pWrapper.uniformMatrix("_matV", matArg.camera.viewMatrix);
  }
  if (uniforms["_matP"]) {
    pWrapper.uniformMatrix("_matP", matArg.camera.projectionMatrix);
  }
  if (uniforms["_matVM"]) {
    pWrapper.uniformMatrix("_matVM", Matrix.multiply(matArg.camera.viewMatrix, matArg.object.Transformer.LocalToGlobal));
  }
  if (uniforms["_matPV"]) {
    pWrapper.uniformMatrix("_matPV", matArg.camera.viewProjectionMatrix);
  }
  if (uniforms["_matPVM"]) {
    pWrapper.uniformMatrix("_matPVM", matArg.object.Transformer.calculateMVPMatrix(matArg.renderStage.Renderer));
  }
  if (uniforms["_matIP"]) {
    pWrapper.uniformMatrix("_matIP", matArg.camera.invProjectionMatrix);
  }
  if (uniforms["_eyePosition"]) {
    pWrapper.uniformVector("_eyePosition", matArg.camera.Transformer.GlobalPosition);
  }
  if (uniforms["_farClip"]) {
    pWrapper.uniformFloat("_farClip", matArg.camera.Far);
  }
  if (uniforms["_nearClip"]) {
    pWrapper.uniformFloat("_nearClip", matArg.camera.Near);
  }
  if (uniforms["_resolution"]) {
    const region = matArg.renderStage.Renderer.region;
    pWrapper.uniformVector("_resolution", new Vector2(region.Width, region.Height));
  }
};

export = BasicMatrixRegisterer;
