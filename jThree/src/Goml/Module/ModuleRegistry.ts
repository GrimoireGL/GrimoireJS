import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');
import GomlModule =require('./GomlModule')

/**
* The class for managing classes registered.
*/
class ModuleRegistry extends JThreeObject
{
  private modules:AssociativeArray<GomlModule>=new AssociativeArray<GomlModule>();

  public addModule(module:GomlModule)
  {
    this.modules.set(module.name,module);
  }

  public getModule(moduleName:string)
  {
    return this.modules.get(moduleName);
  }
}

export = ModuleRegistry;
