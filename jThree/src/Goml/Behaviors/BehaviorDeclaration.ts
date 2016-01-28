import BehaviorDeclarationBody from "./BehaviorDeclarationBody";
import {Action0} from "../../Base/Delegates";

interface BehaviorDeclaration {
  [name: string]: BehaviorDeclarationBody | Action0;
}

export default BehaviorDeclaration;
