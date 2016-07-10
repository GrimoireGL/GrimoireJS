import ComponentBase from "../ComponentBase";
import GomlAttribute from "../GomlAttribute";

class DummyComponent extends ComponentBase {
  public get RequiredAttributes(): GomlAttribute[] {
    let a = new GomlAttribute("name1", 123);
    return [a];
  }

  public get OptionalAttributes(): GomlAttribute[] {
    let a = new GomlAttribute("optional1", 999);
    return [a];
  }

  public dummyMethod(arg: string): void {
    // this is dymmy method for testing broadcastMessage.
  }
}

export default DummyComponent;
