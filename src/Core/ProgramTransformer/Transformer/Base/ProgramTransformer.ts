import IProgramTransformer from "../../Base/IProgramTransformer";
import IProgramTransform from "../../Base/IProgramTransform";
import Q from "q";

class ProgramTransformer implements IProgramTransformer {
  constructor(private _func: (transform: IProgramTransform) => Q.IPromise<IProgramTransform>) {
  }
  public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
    return this._func(input);
  }
}

export default ProgramTransformer
