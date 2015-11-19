import ProgramWrapper = require("../../ProgramWrapper");

class ScalarIntegerRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        gl.uniform1i(index, <number>value);
    }
}

export = ScalarIntegerRegister;
