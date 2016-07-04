import RemoveAttributeVariableTransformer from "./Transformer/RemoveAttributeVariableTransformer";
import RemoveVariableAnnotationTransformer from "./Transformer/RemoveVariableAnnotationsTransformer";
import SourceSeparateTransformer from "./Transformer/SourceSeparateTransformer";
import PrecisionComplementTransformer from "./Transformer/PrecisionComplementTransformer";
import ConditionBlockTransformer from "./Transformer/ConditionBlockTransformer";
import PrecisionParser from "./Transformer/PrecisionParser";
import VariableParser from "./Transformer/VariableParser";
import ImportTransformer from "./Transformer/ImportTransformer";
import RemoveCommentTransformer from "./Transformer/RemoveCommentTransformer";
import IProgramDescription from "./Base/IProgramDescription";
import IProgramTransformer from "./Base/IProgramTransformer";
import IProgramTransform from "./Base/IProgramTransform";
import MaterialManager from "../Materials/MaterialManager";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ProgramTranspiler {

    public static transformerGenerator: () => IProgramTransformer[] = () => {
        const transformers: IProgramTransformer[] = [];
        transformers.push(new RemoveCommentTransformer());
        transformers.push(new ImportTransformer());
        transformers.push(new ConditionBlockTransformer());
        transformers.push(new VariableParser("uniform"));
        transformers.push(new VariableParser("attribute"));
        transformers.push(new SourceSeparateTransformer());
        transformers.push(new RemoveAttributeVariableTransformer());
        transformers.push(new RemoveVariableAnnotationTransformer());
        transformers.push(new PrecisionParser());
        transformers.push(new PrecisionComplementTransformer("mediump"));
        return transformers;
    };

    public static async transform(source: string, transformers: IProgramTransformer[]): Promise<IProgramTransform> {
        let obj = {
            initialSource: source,
            transformSource: source,
            description: {
                fragment: null,
                vertex: null,
                uniforms: null,
                attributes: null,
                fragmentPrecisions: null,
                vertexPrecisions: null,
                functions: null
            }
        };
        for (let i = 0; i < transformers.length; i++) {
            obj.initialSource = source;
            obj = await transformers[i].transform(obj);
        }
        return obj;
    }

    /**
     * Parse raw XMML
     * @param  {string}               whole string code of XMML
     * @return {IProgramDescription} information of parsed codes.
     */
    public static parseCombined(codeString: string): Promise<IProgramDescription> {
        return ProgramTranspiler.transform(codeString, ProgramTranspiler.transformerGenerator()).then((arg: IProgramTransform) => arg.description);
    }

    public static parseInternalImport(source: string): string { // TODO must be moved
        while (true) {
            const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
            if (!regexResult) { break; }
            let importContent;
            importContent = MaterialManager.getShaderChunk(regexResult[1]);
            if (!importContent) {
                console.error(`Required shader chunk '${regexResult[1]}' was not found!!`);
                importContent = "";
            }
            source = source.replace(regexResult[0], `\n${importContent}\n`);
        }
        return source;
    }
}

export default ProgramTranspiler;
