import DefaultComponentBase from "./Component/DefaultComponentBase";
import StringConverter from "./Converters/StringConverter";
import AttributeConverter from "./AttributeConverter";
import NodeDeclaration from "./NodeDeclaration";
import GrimoireInterface from "../GrimoireInterface";
import DummyComponent from "./Component/DummyComponent";
import GomlNodeDeclaration from "./Nodes/GomlNodeDeclaration";

const defaultComponentList: DefaultComponentBase[] = [
  new DummyComponent()];

const defaultNodeList: NodeDeclaration[] = [
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
      GrimoireInterface.registerNodeDec(node);
    });
    defaultConverterList.forEach((converter) => {
      GrimoireInterface.registerConverter(converter.name, converter.convert);
    });
  }
}

export default DefaultPluginRegister;
