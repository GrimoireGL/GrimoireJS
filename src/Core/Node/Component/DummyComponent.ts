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
    const bb = { converter: "string", defaultValue: 123 };
    super(id, { testAttr1: bb }, null);
    this.registerComponent();
  }
}

export default DummyComponent;
