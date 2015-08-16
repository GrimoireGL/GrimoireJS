import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import Vector2 = require("../../../../../Math/Vector2");
import Vector3 = require("../../../../../Math/Vector3");
import Vector4 = require("../../../../../Math/Vector4");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import VectorBase = require("../../../../../Math/VectorBase");

class VectorFloatArrayRegister extends UniformVariableRegisterBase
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any)
    {
        var vec = <VectorBase[]>value;
        if (vec.length > 0) {
            switch (vec[0].ElementCount) {
            case 2:
                gl.UniformVector2Array(index, <Vector2[]>vec);
                break;
            case 3:
                gl.UniformVector3Array(index, <Vector3[]>vec);
                break;
            case 4:
                gl.UniformVector4Array(index, <Vector4[]>vec);
                break;
            }
        }
    }
}

export = VectorFloatArrayRegister;