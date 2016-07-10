import NodeRecipe from "../NodeRecipe";

class GomlNodeRecipe extends NodeRecipe {
  public get Name(): string {
    return "GOML";
  }
  public get Namespace(): string {
    return "basic"; // ??
  }
  public get RequiredComponents(): string[] {
    return ["LoopManager"]; // ??
  }
  public get RequiredComponentsForChildren(): string[] {
    return ["Transform"]; // ??
  }
  public get DefaultAttributes(): {[key: string]: any} {
    return {};
  }
}


export default GomlNodeRecipe;
