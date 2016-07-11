import GomlNode from "./GomlNode";
import GomlConfigurator from "./GomlConfigurator";

abstract class NodeRecipe {
  public abstract get Name(): string;
  public abstract get Namespace(): string;
  public abstract get RequiredComponents(): string[];
  public abstract get RequiredComponentsForChildren(): string[];
  public abstract get DefaultAttributes(): {[key: string]: any };
  public createNode(): GomlNode {
    const configurator = GomlConfigurator.Instance;
    let components = this.RequiredComponents.map((name) => configurator.getComponent(name));
    let node = new GomlNode(this, components);
    return node;
  }
}

export default NodeRecipe;
