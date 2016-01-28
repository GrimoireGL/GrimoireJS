import BehaviorDeclarationBody = require("./BehaviorDeclarationBody");
import Delegates = require("../../Base/Delegates");

interface BehaviorDeclaration {
  [name: string]: BehaviorDeclarationBody | Delegates.Action0;
}

export = BehaviorDeclaration;
