import NodeRecipe from "../NodeRecipe";

class GomlNodeRecipe extends NodeRecipe {
  public get Name(): string {
    return "GOML";
  }
  public get Namespace(): string {
    return "basic"; // ??
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


export default GomlNodeRecipe;
