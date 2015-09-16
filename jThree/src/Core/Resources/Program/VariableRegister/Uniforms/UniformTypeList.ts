import VariableRegisterBase = require("./UniformVariableRegisterBase");
var UniformTypeList:{[name:string]:VariableRegisterBase}=
{
    "float":new (require("./ScalarFloatRegister"))(),
    "integer":new (require("./ScalarIntegerRegister"))(),
    "matrix":new (require("./MatrixFloatRegister"))(),
    "vector": new (require("./VectorFloatRegister"))(),
    "texture": new (require("./Texture2DRegister"))(),
    "vectorarray":new (require("./VectorFloatArrayRegister"))(),
    "matrixarray":new (require("./MatrixFloatArrayRegister"))(),
    "texturearray":new(require("./TextureArrayRegister"))()
};

export = UniformTypeList;
