import ResourceManager = require("../../../ResourceManager");
import ContextComponents = require("../../../../ContextComponents");
import JThreeContext = require("../../../../JThreeContext");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
const TextureRegister = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
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

export = TextureRegister;
