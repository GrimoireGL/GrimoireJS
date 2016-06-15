import Shader from "../Shader/Shader";
import Program from "./Program";
import IHandlableError from "../../../Base/IHandlableError";
interface ILinkError extends IHandlableError {
    program: Program;
    errorMessage: string;
    fragment: Shader;
    vertex: Shader;
}

export default ILinkError;
