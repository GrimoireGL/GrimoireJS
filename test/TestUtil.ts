import Component from "../src/Core/Component";
import ComponentDeclaration from "../src/Core/ComponentDeclaration";
import NSIdentity from "../src/Core/NSIdentity";
import Attribute from "../src/Core/Attribute";
import IAttributeDeclaration from "../src/Interface/IAttributeDeclaration";
import Ensure from "../src/Tools/Ensure";
import GrimoireInterface from "../src/Core/GrimoireInterface";

export default class TestUtil {

  public static DummyComponentDeclaration(): ComponentDeclaration {
    return new ComponentDeclaration(NSIdentity.fromFQN("aaa"), {
      attributes: {

      }
    });
  }
  public static DummyComponent(): Component {
    const dec = TestUtil.DummyComponentDeclaration();
    return dec.generateInstance(null);
  }

  public static DummyAttribute(name: NSIdentity, component: Component, declaration: IAttributeDeclaration): Attribute {
    const attr = new Attribute();
    attr.name = name;
    attr.component = component;
    attr.declaration = declaration;
    const converterName = Ensure.tobeNSIdentity(declaration.converter);
    attr.converter = GrimoireInterface.converters.get(converterName);
    attr.component.attributes.set(attr.name, attr);
    attr.converter.verify(attr);
    return attr;
  }
}
