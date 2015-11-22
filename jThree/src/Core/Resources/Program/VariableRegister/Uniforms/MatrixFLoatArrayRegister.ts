import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import Matrix = require("../../../../../Math/Matrix");
class MatrixFloatArrayRegister extends UniformVariableRegisterBase
{
  public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any)
  {
    var matrix = <number[]>value;
    gl.uniform4fv(index,matrix);
  }
}
export = MatrixFloatArrayRegister;
