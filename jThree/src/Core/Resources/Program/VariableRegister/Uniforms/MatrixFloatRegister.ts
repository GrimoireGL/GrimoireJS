import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import Matrix = require("../../../../../Math/Matrix");
class MatrixFloatRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        if (!value)throw new Error("matrix can not be undefined!");
        gl.uniformMatrix4fv(index,false, (<Matrix>value).rawElements);
    }
}

export = MatrixFloatRegister;
