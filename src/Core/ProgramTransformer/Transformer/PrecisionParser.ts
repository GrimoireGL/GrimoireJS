import DescriptionTransformer from "./Base/DescriptionTransformer";
class PrecisionParser extends DescriptionTransformer {
  constructor() {
    super((transform) => {
      return {
        fragment: transform.description.fragment,
        vertex: transform.description.vertex,
        uniforms: transform.description.uniforms,
        attributes: transform.description.attributes,
        fragmentPrecisions: PrecisionParser._obtainPrecisions(transform.description.fragment),
        vertexPrecisions: PrecisionParser._obtainPrecisions(transform.description.vertex),
        functions: transform.description.functions
      };
    });
  }

  private static _obtainPrecisions(source: string): { [type: string]: string } {
    const regex = /\s*precision\s+([a-z]+)\s+([a-z0-9]+)/g;
    let result: { [type: string]: string } = {};
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break;
      }
      result[found[2]] = found[1];
    }
    return result;
  }
}

export default PrecisionParser;
