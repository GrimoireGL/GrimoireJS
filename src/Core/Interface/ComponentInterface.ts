import IComponentInterface from "./IComponentInterface";
import Component from "../Node/Component";

class ComponentInterface implements IComponentInterface {
  constructor(public components: Component[][][]) {

  }
}

export default ComponentInterface;
