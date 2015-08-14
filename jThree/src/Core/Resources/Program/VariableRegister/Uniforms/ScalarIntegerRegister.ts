import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");

class ScalarIntegerRegister
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any) {
        gl.Uniform1i(index, <number>value);
    }
}

export = ScalarIntegerRegister; 