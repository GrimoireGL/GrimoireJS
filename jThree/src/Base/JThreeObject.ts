import JsHack = require("./JsHack");
import IStringConvertable = require("./IStringConvertable");
class JThreeObject implements IStringConvertable
{
    public toString(): string {
      return JsHack.getObjectName(this);
  }

    public getTypeName(): string {
      return JsHack.getObjectName(this);
  }
}

export=JThreeObject;
