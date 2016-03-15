import IProgramTransformer from "../Base/IProgramTransformer";
import IProgramTransform from "../Base/IProgramTransform";

class StringTransformer implements IProgramTransformer {
  private _stringTransformFunc: (string) => string = null;
  constructor(func: (string) => string) {
    this._stringTransformFunc = func;
  }
  public transform(input: IProgramTransform): Promise<IProgramTransform> {
    let pt: IProgramTransform = {
      initialSource: input.initialSource,
      transformSource: this._stringTransformFunc(input.transformSource),
      description: input.description
    };
    return Promise.resolve(pt);
  }
}

export default StringTransformer
