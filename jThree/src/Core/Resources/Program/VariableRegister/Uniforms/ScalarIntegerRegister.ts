import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");

class ScalarIntegerRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        gl.uniform1i(index, <number>value);
    }
}

export = ScalarIntegerRegister;
