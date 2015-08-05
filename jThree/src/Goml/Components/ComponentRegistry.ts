import JThreeObject = require("../../Base/JThreeObject");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import GomlComponentDeclaration = require("./GomlComponentDeclaration");
import GomlComponentDeclarationBody = require("./GomlComponentDeclarationBody");
/**
* The class for managing classes registered.
*/
class ComponentRegistry extends JThreeObject
{
  constructor()
  {
    super();
  }
  
  private components:AssociativeArray<GomlComponentDeclarationBody>=new AssociativeArray<GomlComponentDeclarationBody>();

  public addComponent(components:GomlComponentDeclaration)
  {
    for(var componentKey in components)
    {
      var component = components[componentKey];
      this.components.set(componentKey,component);
    }
  }

  public getComponent(componentName:string):GomlComponentDeclarationBody
  {
    return this.components.get(componentName);
  }
}

export = ComponentRegistry;
