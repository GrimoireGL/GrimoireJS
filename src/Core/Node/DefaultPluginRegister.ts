import StringConverter from "./Converters/StringConverter";
import AttributeConverter from "./AttributeConverter";
import NodeDeclaration from "./NodeDeclaration";
import ComponentDeclaration from "./ComponentDeclaration";
import GrimoireInterface from "../GrimoireInterface";
import DummyComponentDeclaration from "./Component/DummyComponent";
import GomlNodeDeclaration from "./Nodes/GomlNodeDeclaration";

const defaultComponentList: ComponentDeclaration[] = [
  new DummyComponentDeclaration()];

const defaultNodeList: NodeDeclaration[] = [
  new GomlNodeDeclaration()
];

const defaultConverterList: AttributeConverter[] = [
  new StringConverter()
];

class DefaultPluginRegister {
  public static register(): void {
    defaultComponentList.forEach((component) => {
      GrimoireInterface.registerComponentDec(component);
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
