import GrimoireInterface from "../../GrimoireInterface";
import DefaultPluginDeclarationBase from "../DefaultPluginDeclarationBase";

class GomlNodeDeclaration implements DefaultPluginDeclarationBase {
  public register(): void {
    GrimoireInterface.registerNode("GOML", ["Dummy"], { "testAttr": "gomlNodeDefaultValue" }, null);
  }
}


export default GomlNodeDeclaration;
