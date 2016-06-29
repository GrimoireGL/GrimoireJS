import NamedValue from "../../../Base/NamedValue";
import ResourceManager from "../../ResourceManager";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";
const TextureRegister = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: NamedValue<IVariableDescription>) => {
    for (let key in uniforms) {
        const uniform = uniforms[key];
        if (uniform.variableType !== "sampler2D") { continue; }
        const sourceType = uniform.variableAnnotation["type"];
        const src = uniform.variableAnnotation["src"];
        if (!src) { continue; }
        switch (sourceType) {
            default:
                console.warn(`Unknown texture source type:${sourceType}. src will be interpreted as url`);
            case "url": // TODO WIP
                // TODO implement this
                continue;
            case "id":
            // TODO change register number
                pWrapper.uniformSampler(uniform.variableName, ResourceManager.getTexture(src), 7);
                continue;
        }
    }
};

export default TextureRegister;
