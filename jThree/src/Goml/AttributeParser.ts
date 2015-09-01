import jThreeObject = require("../Base/JThreeObject");
import Quaternion = require("../Math/Quaternion");
import Vector3 = require("../Math/Vector3");
/**
 * Utility class to parse the arguments of attributes.
 */
class AttributeParser extends jThreeObject
{
    /**
     * Parse angle strings.
     * "p" means Pi. Ex) 3/4 p
     * "d" means degree. if this unit was specified, the argument will be parsed as degree. Ex) 90d
     * @param input the string to parse.
     * @returns {number} parsed angle in radians. 
     */
  public static ParseAngle(input:string):number
  {
    if(input.match(/^p$/))return Math.PI;
    var isDegree=input.match(/[0-9E/\(\)\.-]+d$/);
    var needPiMultiply=input.match(/[0-9E/\(\)\.-]+p/);
    //http://regexper.com/#%2F%5E%5B0-9E%2F%5C(%5C)%5C.-%5D%2Bp%3Fd%3F%24%2F
    var replaced=input.replace(/^([0-9E/\(\)\.-]+)p?d?$/,"$1");
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

    /**
     * Parse angle string in 3D.
     * "p" means Pi. Ex) 3/4 p
     * "d" means degree. if this unit was specified, the argument will be parsed as degree. Ex) 90d
     * "eular(x,y,z)" means rotation in eular. This means Z-X-Y rotation like Unity.
     * "axis(angle,x,y,z)" means rotation around specified axis. This means angle radians will be rotated around the axis (x,y,z).
     * This angle can be specified with the character "p" or "d".
     * "x(angle)","y(angle)" or "z(angle)" means rotation around unit axis.
     * This angle can be specified with the character "p" or "d". 
     * @param input the string to be parsed as angle in 3D.
     * @returns {Quaternion} parsed rotation in Quaternion. 
     */
  public static ParseRotation3D(input:string):Quaternion
  {
    input = input.replace(/\s/g, "")
    if(input.match(/^[xyz]\(.+\)$/))
    {
      var signature=input.replace(/^([xyz])\(.+\)$/,"$1");
      var value=input.replace(/^[xyz]\((.+)\)$/,"$1");
      var angle=AttributeParser.ParseAngle(value);
      if(signature=="x")
      {
        return Quaternion.AngleAxis(angle,Vector3.XUnit);
      }else if(signature=="y")
      {
        return Quaternion.AngleAxis(angle,Vector3.YUnit);
      }else
      {
        return Quaternion.AngleAxis(angle,Vector3.ZUnit);
      }
    }else if(input.match(/^euler\([0-9E/\(\)\.-]+p?d?,[0-9E/\(\)\.-]+p?d?,[0-9E/\(\)\.-]+p?d?\)$/))
    {
      var angles=input.replace(/^euler\(([0-9E/\(\)\.-]+p?d?),([0-9E/\(\)\.-]+p?d?),([0-9E/\(\)\.-]+p?d?)\)$/,"$1,$2,$3");
      var splitted=angles.split(/,/);
      return Quaternion.Euler(AttributeParser.ParseAngle(splitted[0]),AttributeParser.ParseAngle(splitted[1]),AttributeParser.ParseAngle(splitted[2]));
    }else if(input.match(/^axis\([0-9E/\(\)\.-]+p?d?,[\d\.]+,[\d\.]+,[\d\.]\)$/))
    {
      var angles=input.replace(/^axis\(([0-9E/\(\)\.-]+p?d?),([\d\.]+),([\d\.]+),([\d\.]+)\)$/,"$1,$2,$3,$4");
      var splitted=angles.split(/,/);
      return Quaternion.AngleAxis(AttributeParser.ParseAngle(splitted[0]),new Vector3(parseFloat(splitted[1]),parseFloat(splitted[2]),parseFloat(splitted[3])));
    }
    return null;
  }
}

export=AttributeParser;
