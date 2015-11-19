import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");

class ScalarFloatRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        gl.uniform1f(index, <number>value);
    }
}

export = ScalarFloatRegister;
