import IProgramTransformer from "../IProgramTransformer";
import IProgramTransform from "../IProgramTransform";

class StringTransformer implements IProgramTransformer {
  private _stringTransformFunc: (string) => string = null;
  constructor(func: (string) => string) {
    this._stringTransformFunc = func;
  }
  public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
    let pt: IProgramTransform = {
      initialSource: input.initialSource,
      transformSource: this._stringTransformFunc(input.transformSource),
      description: input.description
    };
    return Promise.resolve(pt);
  }
}

export default StringTransformer
