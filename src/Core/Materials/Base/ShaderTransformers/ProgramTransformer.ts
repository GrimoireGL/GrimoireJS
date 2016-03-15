import IProgramTransformer from "../IProgramTransformer";
import IProgramTransform from "../IProgramTransform";

class ProgramTransformer implements IProgramTransformer {
  private _func: (IProgramTransform) => Promise<IProgramTransform> = null;
  constructor(func: (IProgramTransform) => Promise<IProgramTransform>) {
    this._func = func;
  }
  public transform(input: IProgramTransform): Promise<IProgramTransform> {
    return this._func(input);
  }
}

export default ProgramTransformer
