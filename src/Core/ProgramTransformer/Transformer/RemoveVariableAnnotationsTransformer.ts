import DescriptionTransformer from "./Base/DescriptionTransformer";
class RemoveVariableAttributeTransformer extends DescriptionTransformer {
    private static _removeVariableAnnotations(source: string): string {
        let regexResult;
        while (regexResult = /@\{.+\}/g.exec(source)) {
            source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
        }
        return source;
    }
    constructor() {
        super((transform) => {
            return {
                fragment: RemoveVariableAttributeTransformer._removeVariableAnnotations(transform.description.fragment),
                vertex: RemoveVariableAttributeTransformer._removeVariableAnnotations(transform.description.vertex),
                uniforms: transform.description.uniforms,
                attributes: transform.description.attributes,
                fragmentPrecisions: transform.description.fragmentPrecisions,
                vertexPrecisions: transform.description.vertexPrecisions,
                functions: transform.description.functions
            };
        });
    }
}

export default RemoveVariableAttributeTransformer;
