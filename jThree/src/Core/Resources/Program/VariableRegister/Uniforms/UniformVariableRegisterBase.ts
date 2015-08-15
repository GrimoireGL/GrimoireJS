import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");

class UniformVariableRegisterBase {
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any) {

    }
}

export = UniformVariableRegisterBase;
/*
 * Overridden registers
 * 
 * * float vector X
 * * float X
 * * integer X
 * * integer vector
 * * texture
 * * array of float vector
 * * float matrix X
 */