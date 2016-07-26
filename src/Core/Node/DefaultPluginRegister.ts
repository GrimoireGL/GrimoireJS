import DefaultPluginDeclarationBase from "./DefaultPluginDeclarationBase";
import StringConverter from "./Converters/StringConverter";
import AttributeConverter from "./AttributeConverter";
import GrimoireInterface from "../GrimoireInterface";
import DummyComponent from "./Component/DummyComponent";
import GomlNodeDeclaration from "./Nodes/GomlNodeDeclaration";

const defaultComponentList: DefaultPluginDeclarationBase[] = [
  new DummyComponent()];

const defaultNodeList: DefaultPluginDeclarationBase[] = [
  new GomlNodeDeclaration()
];

const defaultConverterList: AttributeConverter[] = [
  new StringConverter()
];

class DefaultPluginRegister {
  public static register(): void {
    defaultComponentList.forEach((component) => {
      component.register();
    });
    defaultNodeList.forEach((node) => {
      node.register();
    });
    defaultConverterList.forEach((converter) => {
      GrimoireInterface.registerConverter(converter.name, converter.convert);
    });
  }
}

export default DefaultPluginRegister;
