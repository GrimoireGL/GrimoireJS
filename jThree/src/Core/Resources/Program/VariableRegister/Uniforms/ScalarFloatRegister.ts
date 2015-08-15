import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");

class ScalarFloatRegister
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any) {
        gl.Uniform1f(index, <number>value);
    }
}

export = ScalarFloatRegister; 