import IProgramTransform from "../../Base/IProgramTransform";
import ProgramTransformer from "./ProgramTransformer";
import Q from "q";

class SourceTransformer extends ProgramTransformer {
  constructor(sourceTransformer: (string) => Q.IPromise<string>) {
    super(input => {
      return sourceTransformer(input.transformSource).then<IProgramTransform>((trans) => {
        return {
          initialSource: input.initialSource,
          transformSource: trans,
          description: input.description
        };
      });
    });
  }
}

export default SourceTransformer
