import IProgramDescription from "./IProgramDescription";

interface IProgramTransform {
  initialSource: string;
  transformSource: string;
  description: IProgramDescription;
}
export default IProgramTransform;
