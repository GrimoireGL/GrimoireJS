import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedSet from "../Base/NamespacedSet";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import DummyComponent from "./Component/DummyComponent";
import IAttributeDeclaration from "./IAttributeDeclaration";
import StringConverter from "./Converters/StringConverter";
import AttributeConverter from "./AttributeConverter";
import GrimoireInterface from "../GrimoireInterface";
import GomlNodeDeclaration from "./Nodes/GomlNodeDeclaration";

const defaultConverterList: AttributeConverter[] = [
    new StringConverter()
];

class DefaultPluginRegister {
    public static register(): void {
        // registering component for debug
        const bb: IAttributeDeclaration = { converter: "stringconverter", defaultValue: "hoge" };
        const n: { [key: string]: IAttributeDeclaration } = {};
        n["testAttr"] = bb;
        GrimoireInterface.registerComponent("dummy", n, DummyComponent);
        // registering node for debug
        const id = new NamespacedIdentity("Goml");
        const defaultValueDict = new NamespacedDictionary<any>();
        defaultValueDict.set(new NamespacedIdentity("testAttr"), "gomlNodeDefaultValue");
        GrimoireInterface.registerNode(id, ["Dummy"], defaultValueDict);
        // defaultConverterList.forEach((converter) => {
        //   GrimoireInterface.registerConverter(converter.name, converter.convert);
        // });
    }
}

export default DefaultPluginRegister;
