import Shader from "./Shader";
import IHandlableError from "../../../Base/IHandlableError";
interface IShaderCompileError extends IHandlableError {
    shader: Shader;
    shaderCode: string;
    errorMessage: string;
}

export default IShaderCompileError;
