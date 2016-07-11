import ComponentBase from "../ComponentBase";
import GomlAttribute from "../GomlAttribute";

class DummyComponent extends ComponentBase {
  public get Namespace(): string {
    return "http://aaaa";
  }
  public get RequiredAttributes(): GomlAttribute[] {
    let a = new GomlAttribute("name1", this.Namespace, 123);
    return [a];
  }

  public get OptionalAttributes(): GomlAttribute[] {
    let a = new GomlAttribute("optional1", this.Namespace, 999);
    return [a];
  }

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
  }
}

export default DummyComponent;
