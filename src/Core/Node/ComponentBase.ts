import GomlAttribute from "./GomlAttribute";

abstract class ComponentBase {
  public abstract get RequiredAttributes(): GomlAttribute[];
}

export default ComponentBase;
