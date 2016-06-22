import IProgramTransform from "./IProgramTransform";
import Q from "q";

interface IProgramTransformer {
  transform(input: IProgramTransform): Q.IPromise<IProgramTransform>;
}

export default IProgramTransformer;
