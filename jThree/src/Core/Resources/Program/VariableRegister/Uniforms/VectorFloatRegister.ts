import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import Vector2 = require("../../../../../Math/Vector2");
import Vector3 = require("../../../../../Math/Vector3");
import Vector4 = require("../../../../../Math/Vector4");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import VectorBase = require("../../../../../Math/VectorBase");

class VectorFloatRegister extends UniformVariableRegisterBase {
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any) {
        var vec = <VectorBase>value;
        switch (vec.ElementCount)
        {
            case 2:
                gl.UniformVector2(index, <Vector2>vec);
                break;
            case 3:
                gl.UniformVector3(index, <Vector3>vec);
                break;
            case 4:
                gl.UniformVector4(index, <Vector4>vec);
                break;
        }
    }
}

export = VectorFloatRegister;