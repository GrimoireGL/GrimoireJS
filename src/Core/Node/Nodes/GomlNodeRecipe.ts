import NodeDeclaration from "../NodeDeclaration";
import Constants from "../../Base/Constants";

class GomlNodeDeclaration extends NodeDeclaration {
  public get Name(): string {
    return "GOML";
  }
  public get Namespace(): string {
    return Constants.defaultNamespace;
  }
  public get RequiredComponents(): string[] {
    return ["DummyComponent"]; // ??
  }
  public get RequiredComponentsForChildren(): string[] {
    return ["Transform"]; // ??
  }
  public get DefaultAttributes(): {[key: string]: any} {
    return {"name1": 100}; // ??
  }
}


export default GomlNodeDeclaration;
