import jThreeObject = require("../Base/JThreeObject");

class AttributeParser extends jThreeObject
{
  public static ParseAngle(input:string):number
  {
    if(input.match(/^p$/))return Math.PI;
    var isDegree=input.match(/[0-9E/\(\)\.]+d$/);
    var needPiMultiply=input.match(/[0-9E/\(\)\.]+p/);
    //http://regexper.com/#%2F%5E%5B0-9E%2F%5C(%5C)%5C.-%5D%2Bp%3Fd%3F%24%2F
    var replaced=input.replace(/^([0-9E/\(\)\.]+)p?d?$/,'$1');
    var evalued=eval(replaced);
    if(isDegree!=null)
    {
      evalued*=2*Math.PI/360;
    }
    if(needPiMultiply!=null)
    {
      evalued*=Math.PI;
    }
    return evalued;
  }
}

export=AttributeParser;
