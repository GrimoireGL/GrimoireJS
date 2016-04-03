import IProgramTransform from "../../Base/IProgramTransform";
import IProgramDescription from "../../Base/IProgramDescription";
import ProgramTransformer from "./ProgramTransformer";
class DescriptionTransformer extends ProgramTransformer {
  constructor(descriptionTransform: (transform: IProgramTransform) => IProgramDescription) {
    super((input) => {
      let nextDescription = descriptionTransform(input);
      let pt: IProgramTransform = {
        initialSource: input.initialSource,
        transformSource: input.transformSource,
        description: nextDescription
      };
      return Promise.resolve(pt);
    });
  }
}

export default DescriptionTransformer
