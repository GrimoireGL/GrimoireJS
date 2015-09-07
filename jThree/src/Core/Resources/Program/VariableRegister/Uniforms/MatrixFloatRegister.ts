import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import Matrix = require("../../../../../Math/Matrix");
class MatrixFloatRegister
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any) {
        if (!value)throw new Error("matrix can not be undefined!");
        gl.UniformMatrix(index, <Matrix>value);
    }
}

export = MatrixFloatRegister; 