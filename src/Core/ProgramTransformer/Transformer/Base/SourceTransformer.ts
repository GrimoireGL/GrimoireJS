import IProgramTransform from "../../Base/IProgramTransform";
import ProgramTransformer from "./ProgramTransformer";

class SourceTransformer extends ProgramTransformer {
  constructor(sourceTransformer: (string) => string) {
    super((input) => {
      let pt: IProgramTransform = {
        initialSource: input.initialSource,
        transformSource: sourceTransformer(input.transformSource),
        description: input.description
      };
      return Promise.resolve(pt);
    });
  }
}

export default SourceTransformer
