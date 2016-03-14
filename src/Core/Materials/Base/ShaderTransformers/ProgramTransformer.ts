import IProgramTransformer from "../IProgramTransformer";
import IProgramTransform from "../IProgramTransform";

class ProgramTransformer implements IProgramTransformer {
  private _func: (IProgramTransform) => Q.IPromise<IProgramTransform> = null;
  constructor(func: (IProgramTransform) => Q.IPromise<IProgramTransform>) {
    this._func = func;
  }
  public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
    return this._func(input);
  }
}

export default ProgramTransformer
