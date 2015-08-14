import AttributeRegisteringArgument = require("./AttributeRegisteringArgument");
import UniformRegisteringArgument = require("./UniformRegisteringArgument");
/**
 * Interface to declare uniform and attribute variables into shaders.
 */
interface VariableRegisteringArgument {
    attributes?: AttributeRegisteringArgument;
    uniforms?:UniformRegisteringArgument;
}

export=VariableRegisteringArgument;