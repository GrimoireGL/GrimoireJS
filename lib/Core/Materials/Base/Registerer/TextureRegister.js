import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
const TextureRegister = (gl, pWrapper, matArg, uniforms) => {
    const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
    for (let key in uniforms) {
        const uniform = uniforms[key];
        if (uniform.variableType !== "sampler2D") {
            continue;
        }
        const sourceType = uniform.variableAnnotation["type"];
        const src = uniform.variableAnnotation["src"];
        if (!src) {
            continue;
        }
        switch (sourceType) {
            default:
                console.warn(`Unknown texture source type:${sourceType}. src will be interpreted as url`);
            case "url":
                // TODO implement this
                continue;
            case "id":
                pWrapper.uniformSampler(uniform.variableName, rm.getTexture(src), 7);
                continue;
        }
    }
};
export default TextureRegister;
