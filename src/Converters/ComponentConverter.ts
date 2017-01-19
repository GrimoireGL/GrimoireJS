import Component from "../Node/Component";
import GomlNode from "../Node/GomlNode";
import Attribute from "../Node/Attribute";

function ComponentConverter(val: any, attr: Attribute): any {
  if (!attr.declaration["target"]) {
    throw new Error("Component converter require to be specified target");
  }
  if (val === null) {
    return null;
  }
  if (val instanceof GomlNode) {
    return (val as GomlNode).getComponent(attr.declaration["target"]);
  } else if (val instanceof Component) {
    if ((val as Component).name === attr.declaration["target"]) {
      return val; // check component type?
    } else {
      throw new Error(`Specified component must be ${attr.declaration["target"]}`);
    }
  } else {
    const n = attr.tree(val).first();
    if (n) {
      return n.getComponent(attr.declaration["target"]);
    }
    return null;
  }
}

export default ComponentConverter;
