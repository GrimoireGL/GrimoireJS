import JThreeObject = require("../../Base/JThreeObject");
import BehaviorDeclaration = require("./BehaviorDeclaration");
import BehaviorDeclarationBody = require("./BehaviorDeclarationBody");
import Delegates = require("../../Base/Delegates");
/**
* Provides feature to register behavior.
*/
class BehaviorRegistry extends JThreeObject {
  constructor() {
    super();
  }

  private behaviorInstances: { [id: string]: BehaviorDeclarationBody } = {};

  public defineBehavior(behaviorName: string, behaviorDeclaration: BehaviorDeclarationBody | Delegates.Action0);
  public defineBehavior(behaviorDeclarations: BehaviorDeclaration);
  public defineBehavior(nameOrDeclarations: string | BehaviorDeclaration, behaviorDeclaration?: BehaviorDeclarationBody | Delegates.Action0) {
    if (typeof nameOrDeclarations === "string") {
      const behaviorName = <string>nameOrDeclarations;
      this.behaviorInstances[behaviorName] = this.generateBehaviorInstance(behaviorDeclaration);
    } else {
      // assume arguments are object.
      const behaviorDeclarations = <BehaviorDeclaration>nameOrDeclarations;
      for (let behaviorKey in behaviorDeclarations) {
        this.behaviorInstances[behaviorKey] = this.generateBehaviorInstance(behaviorDeclarations[behaviorKey]);
      }
    }
  }

  public getBehavior(behaviorName: string): BehaviorDeclarationBody {
    return this.behaviorInstances[behaviorName];
  }

  private generateBehaviorInstance(behaviorDecl: BehaviorDeclarationBody | Delegates.Action0): BehaviorDeclarationBody {
    if (typeof behaviorDecl === "function") {
      // Assume generation seed is constructor of behavior
      return <BehaviorDeclarationBody>(new (<Delegates.Action0>behaviorDecl)());
    } else {
      return this.copyObject(behaviorDecl);
    }
  }
  /**
   * Generate reference copy
   * @param targetObject the object you want to copy
   * @returns {}
   */
  private copyObject(targetObject: any) {
    if (typeof targetObject === "object") {
      const newObject = {};
      for (let key in targetObject) {
        if (targetObject.hasOwnProperty(key)) {
          const property = targetObject[key];
          newObject[key] = this.copyObject(property);
        }
      }
      return newObject;
    } else {
      return targetObject;
    }
  }
}

export = BehaviorRegistry;
