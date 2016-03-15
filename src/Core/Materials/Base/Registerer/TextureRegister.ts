import ResourceManager from "../../../ResourceManager";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import ProgramWrapper from "../../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../IApplyMaterialArgument";
const TextureRegister = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }) => {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
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
                pWrapper.uniformSampler(uniform.variableName, rm.getTexture(src), 7);
                continue;
        }
    }
};

export default TextureRegister;
