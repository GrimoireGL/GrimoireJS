import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import BehaviorDeclaration = require('./BehaviorDeclaration');
import BehaviorDeclarationBody = require('./BehaviorDeclarationBody');
/**
* The class for managing classes registered.
*/
class BehaviorRegistry extends JThreeObject
{
  constructor()
  {
    super();
  }
  
  private components:AssociativeArray<BehaviorDeclarationBody>=new AssociativeArray<BehaviorDeclarationBody>();

  public addComponent(components:BehaviorDeclaration)
  {
    for(var componentKey in components)
    {
      var component = components[componentKey];
      this.components.set(componentKey,component);
    }
  }

  public getComponent(componentName:string):BehaviorDeclarationBody
  {
    return this.components.get(componentName);
  }
}

export = BehaviorRegistry;
