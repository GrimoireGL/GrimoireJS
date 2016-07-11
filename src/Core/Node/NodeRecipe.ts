import GomlNode from "./GomlNode";
import GomlConfigurator from "./GomlConfigurator";

abstract class NodeRecipe {
  public abstract get Name(): string;
  public abstract get Namespace(): string;
  public abstract get RequiredComponents(): string[];
  public abstract get RequiredComponentsForChildren(): string[];
  public abstract get DefaultAttributes(): {[key: string]: any };
  public createNode(inheritedRequiredConponents?: string[]): GomlNode {
    const configurator = GomlConfigurator.Instance;
    let requiredComponents = this.RequiredComponents;
    if (inheritedRequiredConponents) {
      requiredComponents = requiredComponents.concat(inheritedRequiredConponents);
      requiredComponents = requiredComponents.filter((x, i, self) => self.indexOf(x) === i); // remove overLap
    }
    let components = requiredComponents.map((name) => configurator.getComponent(name));
    let requiredAttrs = components.map((c) => c.RequiredAttributes);
    let attributes = requiredAttrs.reduce((pre, current) => pre === undefined ? current : pre.concat(current));
    let attributesDict = {};
    attributes.forEach((attr) => {
      if (attributesDict[attr.Name]) {
        attributesDict[attr.Name].push(attr);
      }else {
        attributesDict[attr.Name] = [attr];
      }
    });

    return new GomlNode(this, components, attributesDict);
  }
}

export default NodeRecipe;
