import GomlAttribute from "./GomlAttribute";

abstract class ComponentBase {
  public abstract get RequiredAttributes(): GomlAttribute[];
  public abstract get OptionalAttributes(): GomlAttribute[];
}

export default ComponentBase;