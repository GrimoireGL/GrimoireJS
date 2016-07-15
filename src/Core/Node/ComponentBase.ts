import GomlAttribute from "./GomlAttribute";

abstract class ComponentBase {
  public get Namespace(): string;
  public get RequiredAttributes(): GomlAttribute[];
  public get OptionalAttributes(): GomlAttribute[];
}

export default ComponentBase;
