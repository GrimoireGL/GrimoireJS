import IProgramTransformer from "../../Base/IProgramTransformer";
import IProgramTransform from "../../Base/IProgramTransform";

class ProgramTransformer implements IProgramTransformer {
  constructor(private _func: (transform: IProgramTransform) => Promise<IProgramTransform>) {
  }
  public transform(input: IProgramTransform): Promise<IProgramTransform> {
    return this._func(input);
  }
}

export default ProgramTransformer
