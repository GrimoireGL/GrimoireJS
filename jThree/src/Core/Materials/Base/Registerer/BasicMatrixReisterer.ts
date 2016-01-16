import Matrix = require("../../../../Math/Matrix");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
const BasicMatrixRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
  if (uniforms["_matM"]) {
    pWrapper.uniformMatrix("_matM", matArg.object.Transformer.LocalToGlobal);
  }
  if (uniforms["_matV"]) {
    pWrapper.uniformMatrix("_matV", matArg.renderStage.Renderer.Camera.viewMatrix);
  }
  if (uniforms["_matP"]) {
    pWrapper.uniformMatrix("_matP", matArg.renderStage.Renderer.Camera.projectionMatrix);
  }
  if (uniforms["_matVM"]) {
    pWrapper.uniformMatrix("_matVM", Matrix.multiply(matArg.renderStage.Renderer.Camera.viewMatrix, matArg.object.Transformer.LocalToGlobal));
  }
  if (uniforms["_matPV"]) {
    pWrapper.uniformMatrix("_matPV", matArg.renderStage.Renderer.Camera.viewProjectionMatrix);
  }
  if (uniforms["_matPVM"]) {
    pWrapper.uniformMatrix("_matPVM", matArg.object.Transformer.calculateMVPMatrix(matArg.renderStage.Renderer));
  }
  if (uniforms["_matIP"]) {
    pWrapper.uniformMatrix("_matIP", Matrix.inverse(matArg.renderStage.Renderer.Camera.projectionMatrix));
  }
};

export = BasicMatrixRegisterer;
