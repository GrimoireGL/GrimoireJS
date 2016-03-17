import IProgramTransform from "./IProgramTransform";

interface IProgramTransformer {
  transform(input: IProgramTransform): Promise<IProgramTransform>;
}

export default IProgramTransformer;
