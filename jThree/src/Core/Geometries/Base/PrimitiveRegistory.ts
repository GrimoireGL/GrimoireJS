import Geometry = require("./Geometry");
import ContextComponents = require("../../../ContextComponents");
import IContextComponent = require("../../../IContextComponent");
class PrimitiveRegistory implements IContextComponent
{
  public getContextComponentIndex():number
  {
    return ContextComponents.PrimitiveRegistory;
  }
  /**
   * Registered primitives
   */
  private _primitives:{[primitiveName:string]:Geometry} = {};

  public addPrimitive(key:string,geo:Geometry):void
  {
    if(this._primitives[key])
    {
      console.warn(`The geometry '${key}' is already assigned. The old geometry will be replaced, this might lead some bug.`);
    }
    this._primitives[key] = geo;
  }

  public getPrimitive(key:string):Geometry
  {
    return this._primitives[key];
  }
}
export = PrimitiveRegistory;
