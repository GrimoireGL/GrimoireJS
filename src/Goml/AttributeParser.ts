import jThreeObject from "../Base/JThreeObject";
import Quaternion from "../Math/Quaternion";
import Vector3 from "../Math/Vector3";
/**
 * Utility class to parse the arguments of attributes.
 */
class AttributeParser extends jThreeObject {
  /**
   * Parse angle strings.
   * "p" means Pi. Ex) 3/4 p
   * "d" means degree. if this unit was specified, the argument will be parsed as degree. Ex) 90d
   * @param input the string to parse.
   * @returns {number} parsed angle in radians.
   */
  public static parseAngle(input: string): number {
    const regex = /^([0-9\.]+)?(\/)?([0-9\.]+)?(pdeg|deg|d|p|r|rad|prad)?$/gm;
    const result = regex.exec(input);
    let numerator = 1.0;
    let fract = 1.0;
    let isDegree = true;
    if (result[1]) {
      numerator = parseFloat(result[1]);
    }
    if (result[2] && result[3]) {
      fract = parseFloat(result[3]);
    }
    if (result[4]) {
      if (result[4].match(/^r|rad|prad|p$/gm)) {
        isDegree = false;
      }
      if (result[4].match(/^p|pdeg|prad$/gm)) {
        numerator *= Math.PI;
      }
    }
    if (!isDegree) {
      return numerator / fract;
    } else {
      return numerator / fract / 360 * 2 * Math.PI;
    }
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
  public static parseRotation3D(input: string): Quaternion {
    const regex = /^(?:(x|y|z|axis)\()(.+)?\)$/gm;
    const result = regex.exec(input);
    if (result) {
      if (result[1] === "x") {
        return Quaternion.angleAxis(AttributeParser.parseAngle(result[2]), Vector3.XUnit);
      }
      if (result[1] === "y") {
        return Quaternion.angleAxis(AttributeParser.parseAngle(result[2]), Vector3.YUnit);
      }
      if (result[1] === "z") {
        return Quaternion.angleAxis(AttributeParser.parseAngle(result[2]), Vector3.ZUnit);
      }
      if (result[1] === "axis") {
        const splitted = result[1].split(",");
        return Quaternion.angleAxis(AttributeParser.parseAngle(splitted[0]), new Vector3(parseFloat(splitted[1]), parseFloat(splitted[2]), parseFloat(splitted[3])));
      }
    } else {
      // Assume the input was euler angles
      const splitted = input.split(",");
      return Quaternion.euler.apply(Quaternion.euler, splitted.map((s) => AttributeParser.parseAngle(s)));
    }
  }
}

export default AttributeParser;
