import DescriptionTransformer from "./Base/DescriptionTransformer";
class RemoveAttributeVariableTransformer extends DescriptionTransformer {
  constructor() {
    super((transform) => {
      return {
        fragment: RemoveAttributeVariableTransformer._removeAttributeVariables(transform.description.fragment),
        vertex: transform.description.vertex,
        uniforms: transform.description.uniforms,
        attributes: transform.description.attributes,
        fragmentPrecisions: transform.description.fragmentPrecisions,
        vertexPrecisions: transform.description.vertexPrecisions,
        functions: transform.description.functions
      };
    });
  }

  private static _removeAttributeVariables(source: string): string {
    const regex = /(\s*attribute\s+[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+;)/;
    while (true) {
      let found = regex.exec(source);
      if (!found) {
        break;
      }
      source = source.replace(found[0], "");
    }
    return source;
  }
}

export default RemoveAttributeVariableTransformer;
