import JsHack = require("./JsHack");
import IStringConvertable = require("./IStringConvertable");
class JThreeObject implements IStringConvertable
{
  toString(): string {
      return JsHack.getObjectName(this);
  }

  getTypeName(): string {
      return JsHack.getObjectName(this);
  }
}

export=JThreeObject;
