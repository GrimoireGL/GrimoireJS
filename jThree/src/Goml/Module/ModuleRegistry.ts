import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');
type AttributeDeclation={
  handler?:Delegates.Action1<GomlAttribute>,
  converter:string,
  name:string
};
type Module={
  name:string,
  order?:number
  attributes?:AttributeDeclation[]
  update?:Delegates.Action0,
};

class ModuleRegistry extends JThreeObject
{
  private modules:AssociativeArray<Module>=new AssociativeArray<Module>();

  public addModule(module:Module)
  {
    this.modules.set(module.name,module);
  }

  public getModule(moduleName:string)
  {
    return this.modules.get(moduleName);
  }
}

export = ModuleRegistry;
