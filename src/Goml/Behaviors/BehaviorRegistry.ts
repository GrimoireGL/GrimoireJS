import JThreeObject from "../../Base/JThreeObject";
import BehaviorDeclaration from "./BehaviorDeclaration";
import BehaviorDeclarationBody from "./BehaviorDeclarationBody";
import {Action0} from "../../Base/Delegates";
/**
* Provides feature to register behavior.
*/
class BehaviorRegistry extends JThreeObject {
  constructor() {
    super();
  }

  private _behaviorInstances: { [id: string]: BehaviorDeclarationBody } = {};

  public defineBehavior(behaviorName: string, behaviorDeclaration: BehaviorDeclarationBody | Action0);
  public defineBehavior(behaviorDeclarations: BehaviorDeclaration);
  public defineBehavior(nameOrDeclarations: string | BehaviorDeclaration, behaviorDeclaration?: BehaviorDeclarationBody | Action0) {
    if (typeof nameOrDeclarations === "string") {
      const behaviorName = <string>nameOrDeclarations;
      this._behaviorInstances[behaviorName] = this._generateBehaviorInstance(behaviorDeclaration);
    } else {
      // assume arguments are object.
      const behaviorDeclarations = <BehaviorDeclaration>nameOrDeclarations;
      for (let behaviorKey in behaviorDeclarations) {
        this._behaviorInstances[behaviorKey] = this._generateBehaviorInstance(behaviorDeclarations[behaviorKey]);
      }
    }
  }

  public getBehavior(behaviorName: string): BehaviorDeclarationBody {
    return this._behaviorInstances[behaviorName];
  }

  private _generateBehaviorInstance(behaviorDecl: BehaviorDeclarationBody | Action0): BehaviorDeclarationBody {
    if (typeof behaviorDecl === "function") {
      // Assume generation seed is constructor of behavior
      return <BehaviorDeclarationBody>(new (<Action0>behaviorDecl)());
    } else {
      return this._copyObject(behaviorDecl);
    }
  }
  /**
   * Generate reference copy
   * @param targetObject the object you want to copy
   * @returns {}
   */
  private _copyObject(targetObject: any) {
    if (typeof targetObject === "object") {
      const newObject = {};
      for (let key in targetObject) {
        if (targetObject.hasOwnProperty(key)) {
          const property = targetObject[key];
          newObject[key] = this._copyObject(property);
        }
      }
      return newObject;
    } else {
      return targetObject;
    }
  }
}

export default BehaviorRegistry;
