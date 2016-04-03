import DescriptionTransformer from "./Base/DescriptionTransformer";
import IProgramDescription from "../Base/IProgramDescription";
class PrecisionComplementTransformer extends DescriptionTransformer {
  constructor(defaultPrecision: string) {
    super((transform) => {
      let description: IProgramDescription = {
        fragment: transform.description.fragment,
        vertex: transform.description.vertex,
        uniforms: transform.description.uniforms,
        attributes: transform.description.attributes,
        fragmentPrecisions: transform.description.fragmentPrecisions,
        vertexPrecisions: transform.description.vertexPrecisions,
        functions: transform.description.functions
      };
      if (!transform.description.fragmentPrecisions["float"]) {// When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
        description.fragment = PrecisionComplementTransformer._addPrecision(description.fragment, "float", "mediump");
        description.fragmentPrecisions["float"] = defaultPrecision;
      }
      return description;
    });
  }

  private static _addPrecision(source: string, targetType: string, precision: string): string {
    return `precision ${precision} ${targetType};\n` + source;
  }
}

export default PrecisionComplementTransformer;
