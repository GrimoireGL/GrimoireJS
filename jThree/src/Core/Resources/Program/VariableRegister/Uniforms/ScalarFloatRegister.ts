import ProgramWrapper = require("../../ProgramWrapper");

class ScalarFloatRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        gl.uniform1f(index, <number>value);
    }
}

export = ScalarFloatRegister;
