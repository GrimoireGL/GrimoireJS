import IProgramTransformer from "../IProgramTransformer";
import IProgramTransform from "../IProgramTransform";
import IProgramDescription from "../IProgramDescription";

class DescriptionTransformer implements IProgramTransformer {
  private _descriptionTransformFunc: (IProgramTransform) => IProgramDescription = null;
  constructor(func: (IProgramTransform) => IProgramDescription) {
    this._descriptionTransformFunc = func;
  }
  public transform(input: IProgramTransform): Promise<IProgramTransform> {
    let nextDescription = this._descriptionTransformFunc(input);
    let pt: IProgramTransform = {
      initialSource: input.initialSource,
      transformSource: input.transformSource,
      description: nextDescription
    };
    return Promise.resolve(pt);
  }
}

export default DescriptionTransformer
