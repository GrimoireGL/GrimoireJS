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
      var component = components[componentKey];
      this.behaviorInstances.set(componentKey,component);
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
          //TODO Copy object

      }
  }
}

export = BehaviorRegistry;
