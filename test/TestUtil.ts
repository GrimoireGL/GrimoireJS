import Attribute from "../src/Core/Attribute";
import Component from "../src/Core/Component";
import ComponentDeclaration from "../src/Core/ComponentDeclaration";
import GomlNode from "../src/Core/GomlNode";
import GomlParser from "../src/Core/GomlParser";
import GrimoireInterface from "../src/Core/GrimoireInterface";
import Identity from "../src/Core/Identity";
import IAttributeDeclaration from "../src/Interface/IAttributeDeclaration";
import ITreeInitializedInfo from "../src/Interface/ITreeInitializedInfo";
import Ensure from "../src/Tools/Ensure";
import XMLReader from "../src/Tools/XMLReader";

export default class TestUtil {

  public static DummyComponentDeclaration(): ComponentDeclaration {
    return new ComponentDeclaration(Identity.fromFQN("aaa"), {
      attributes: {

      },
    });
  }
  public static DummyComponent(): Component {
    const dec = TestUtil.DummyComponentDeclaration();
    return dec.generateInstance();
  }

  public static DummyAttribute(name: Identity, component: Component, declaration: IAttributeDeclaration): Attribute {
    const attr = new Attribute();
    attr.name = name;
    attr.component = component;
    attr.declaration = declaration;
    const converterName = Ensure.tobeCnverterIdentity(declaration.converter);
    attr.converter = GrimoireInterface.converters.get(converterName);
    attr.component.attributes.set(attr.name, attr);
    attr.converter.verify(attr);
    return attr;
  }

  public static DummyTreeInit(goml: string): GomlNode {
    const doc = XMLReader.parseXML(goml);
    const rootNode = GomlParser.parse(doc);

    rootNode.setMounted(true);
    rootNode.broadcastMessage("treeInitialized", {
      ownerScriptTag: null,
      id: rootNode.id,
    } as ITreeInitializedInfo);
    rootNode.sendInitializedMessage({
      ownerScriptTag: null,
      id: rootNode.id,
    } as ITreeInitializedInfo);
    return rootNode;
  }
}
