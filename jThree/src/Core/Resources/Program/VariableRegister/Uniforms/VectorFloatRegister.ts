import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import Vector2 = require("../../../../../Math/Vector2");
import Vector3 = require("../../../../../Math/Vector3");
import Vector4 = require("../../../../../Math/Vector4");
import VectorBase = require("../../../../../Math/VectorBase");

class VectorFloatRegister extends UniformVariableRegisterBase {
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any) {
        var vec = <VectorBase>value;
        switch (vec.ElementCount)
        {
            case 2:
              var vec2 = (<Vector2>vec);
                gl.uniform2f(index, vec2.X,vec2.Y);
                break;
            case 3:
            var vec3 = (<Vector3>vec);
                gl.uniform3f(index, vec3.X,vec3.Y,vec3.Z);
                break;
            case 4:
              var vec4 =(<Vector4>vec);
                gl.uniform4f(index, vec4.X,vec4.Y,vec4.Z,vec4.W);
                break;
        }
    }
}

export = VectorFloatRegister;
