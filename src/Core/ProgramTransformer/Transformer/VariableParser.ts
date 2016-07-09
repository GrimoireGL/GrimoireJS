import NamedValue from "../../../Base/NamedValue";
import IVariableDescription from "../Base/IVariableDescription";
import DescriptionTransformer from "./Base/DescriptionTransformer";
import JSON5 from "json5";

class VariableParser extends DescriptionTransformer {
    private static _parseVariableAttributes(attributes: string): NamedValue<string> {
        return JSON5.parse(attributes);
    }

    private static _generateVariableFetchRegex(variableType: string): RegExp {
        return new RegExp(`(?:@(\\{.+\\}))?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*(\\d+)\\s*\\]\\s*)?\\s*;`, "g");
    }

    private static _parseVariables(source: string, variableType: string): NamedValue<IVariableDescription> {
        const result = <NamedValue<IVariableDescription>>{};
        const regex = VariableParser._generateVariableFetchRegex(variableType);
        let regexResult;
        while ((regexResult = regex.exec(source))) {
            let name = regexResult[4];
            let type = regexResult[3];
            let precision = regexResult[2];
            let rawAnnotations = regexResult[1];
            result[name] = <IVariableDescription>{
                variableName: name,
                variableType: type,
                variablePrecision: precision,
                variableAnnotation: rawAnnotations ? VariableParser._parseVariableAttributes(rawAnnotations) : {},
                isArray: (typeof regexResult[5] !== "undefined"),
                arrayLength: (typeof regexResult[5] !== "undefined") ? parseInt(regexResult[5], 10) : undefined
            };
        }
        return result;
    }
    constructor(target: string) {
        super((transform) => {
            const input = {
                fragment: transform.description.fragment,
                vertex: transform.description.vertex,
                uniforms: transform.description.uniforms,
                attributes: transform.description.attributes,
                fragmentPrecisions: transform.description.fragmentPrecisions,
                vertexPrecisions: transform.description.vertexPrecisions,
                functions: transform.description.functions
            };
            const variables = VariableParser._parseVariables(transform.transformSource, target);
            switch (target) {
                case "uniform":
                    input.uniforms = variables;
                    break;
                case "attribute":
                    input.attributes = variables;
                    break;
                default:
                    throw new Error("Unknown variable type!!");
            }
            return input;
        });
    }

}

export default VariableParser;
