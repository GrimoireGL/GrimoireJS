import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import BehaviorDeclaration = require('./BehaviorDeclaration');
import BehaviorDeclarationBody = require('./BehaviorDeclarationBody');
import Delegates = require("../../Base/Delegates");
/**
* The class for managing classes registered.
*/
class BehaviorRegistry extends JThreeObject
{
  constructor()
  {
    super();
  }
  
  private behaviorInstances:AssociativeArray<BehaviorDeclarationBody>=new AssociativeArray<BehaviorDeclarationBody>();
  
  public addBehavior(components:BehaviorDeclaration)
  {
    for(var componentKey in components)
    {
      this.behaviorInstances.set(componentKey,this.generateBehaviorInstance(components,componentKey));
    }
  }

  public getBehavior(componentName:string):BehaviorDeclarationBody
  {
    return this.behaviorInstances.get(componentName);
  }

  private generateBehaviorInstance(behaviorDecl:BehaviorDeclaration,key:string):BehaviorDeclarationBody {
      var generationSeed = behaviorDecl[key];
      if (typeof generationSeed === "function") {
          //Assume generation seed is constructor of behavior
          return <BehaviorDeclarationBody>(new (<Delegates.Action0>generationSeed)());
      } else {
          return this.copyObject(generationSeed);
      }
  }
    /**
     * Generate reference copy
     * @param targetObject the object you want to copy 
     * @returns {} 
     */
  private copyObject(targetObject:any) {
      if (typeof targetObject === "object") {
          var newObject = {};
          for (var key in targetObject) {
              if (targetObject.hasOwnProperty(key)) {
                  var property = targetObject[key];
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
