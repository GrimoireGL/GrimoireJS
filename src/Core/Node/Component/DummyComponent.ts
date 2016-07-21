import ComponentDeclaration from "../ComponentDeclaration";
import NamespacedIdentity from "../../Base/NamespacedIdentity";
import AttributeDeclaration from "../AttributeDeclaration";

class DummyComponent extends ComponentDeclaration {

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
  }
  constructor() {
    const namespace = "http://aaaa";
    let id = new NamespacedIdentity(namespace, "dummy");
    let b = new AttributeDeclaration(new NamespacedIdentity("testAttr1"), 123, new NamespacedIdentity("string"));
    super(id, { testAttr1: b }, null);
  }
}

export default DummyComponent;
