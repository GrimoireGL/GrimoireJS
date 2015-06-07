import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');
import GomlModuleDeclaration = require('./GomlModuleDeclaration');
import GomlModuleDeclarationBody = require('./GomlModuleDeclarationBody');
/**
* The class for managing classes registered.
*/
class ModuleRegistry extends JThreeObject
{
  constructor()
  {
    super();
    this.addModule({
      "test":{
        
      }
    });
  }
  
  private modules:AssociativeArray<GomlModuleDeclarationBody>=new AssociativeArray<GomlModuleDeclarationBody>();

  public addModule(modules:GomlModuleDeclaration)
  {
    for(var moduleKey in modules)
    {
      var module = modules[moduleKey];
      this.modules.set(moduleKey,module);
    }
  }

  public getModule(moduleName:string):GomlModuleDeclarationBody
  {
    return this.modules.get(moduleName);
  }
}

export = ModuleRegistry;
