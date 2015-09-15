import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import Matrix = require("../../../../../Math/Matrix");
class MatrixFloatArrayRegister extends UniformVariableRegisterBase
{
  public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any)
  {
    var matrix = <number[]>value;
    gl.UniformMatrixArray(index,matrix);
  }
}
export = MatrixFloatArrayRegister;
