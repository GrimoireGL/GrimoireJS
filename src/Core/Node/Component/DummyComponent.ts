import Attribute from "../Attribute";
import NamespacedDictionary from "../../Base/NamespacedDictionary";
import Component from "../Component";
import ComponentDeclaration from "../ComponentDeclaration";
import NamespacedIdentity from "../../Base/NamespacedIdentity";
import AttributeDeclaration from "../AttributeDeclaration";

class DummyComponent extends Component {

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
  }
  // constructor() {
  //   const namespace = "http://aaaa";
  //   let id = new NamespacedIdentity(namespace, "dummy");
  //   const bb = { converter: "string", defaultValue: 123 };
  //   const attr =
  //   const n = new NamespacedDictionary<Attribute>();
  //   n.set(new NamespacedIdentity(namespace, "testAttr"),bb);
  //
  //   super(id, n, null);
  //   // this.registerComponent();
  // }
}

export default DummyComponent;
