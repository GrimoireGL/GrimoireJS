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
};

export = BasicMatrixRegisterer;
