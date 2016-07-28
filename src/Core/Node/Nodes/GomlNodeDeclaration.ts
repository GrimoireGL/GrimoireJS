import NamespacedDictionary from "../../Base/NamespacedDictionary";
import NamespacedSet from "../../Base/NamespacedSet";
import NamespacedIdentity from "../../Base/NamespacedIdentity";
import NodeDeclaration from "../NodeDeclaration";
import Constants from "../../Base/Constants";

class GomlNodeDeclaration extends NodeDeclaration {

  constructor() {
    const id = new NamespacedIdentity(Constants.defaultNamespace, "Goml");
    const req = new NamespacedSet();
    req.push(new NamespacedIdentity("Dummy"));
    const defaultValueDict = new NamespacedDictionary<any>();
    defaultValueDict.set(new NamespacedIdentity("testAttr"), "gomlNodeDefaultValue");
    const reqForChildren = new NamespacedSet();
    reqForChildren.push(new NamespacedIdentity("Dummy"));
    super(id, req, defaultValueDict, null);
  }
}


export default GomlNodeDeclaration;
