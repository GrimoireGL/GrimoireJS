import JThreeObject from "../../Base/JThreeObject";
/**
* Provides feature to register behavior.
*/
class BehaviorRegistry extends JThreeObject {
    constructor() {
        super();
        this._behaviorInstances = {};
    }
    defineBehavior(nameOrDeclarations, behaviorDeclaration) {
        if (typeof nameOrDeclarations === "string") {
            const behaviorName = nameOrDeclarations;
            this._behaviorInstances[behaviorName] = this._generateBehaviorInstance(behaviorDeclaration);
        }
        else {
            // assume arguments are object.
            const behaviorDeclarations = nameOrDeclarations;
            for (let behaviorKey in behaviorDeclarations) {
                this._behaviorInstances[behaviorKey] = this._generateBehaviorInstance(behaviorDeclarations[behaviorKey]);
            }
        }
    }
    getBehavior(behaviorName) {
        return this._behaviorInstances[behaviorName];
    }
    _generateBehaviorInstance(behaviorDecl) {
        if (typeof behaviorDecl === "function") {
            // Assume generation seed is constructor of behavior
            return (new behaviorDecl());
        }
        else {
            return this._copyObject(behaviorDecl);
        }
    }
    /**
     * Generate reference copy
     * @param targetObject the object you want to copy
     * @returns {}
     */
    _copyObject(targetObject) {
        if (typeof targetObject === "object") {
            const newObject = {};
            for (let key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    const property = targetObject[key];
                    newObject[key] = this._copyObject(property);
                }
            }
            return newObject;
        }
        else {
            return targetObject;
        }
    }
}
export default BehaviorRegistry;
