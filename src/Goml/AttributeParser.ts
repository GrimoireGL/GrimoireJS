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
    const regex = /^ *(-? *(?:0|[1-9]\d*)(?: *\.\d+)?) *(?:\/ *((?:0|[1-9]\d*)(?: *\.\d+)?))? *(p|prad|deg|d|r|rad)? *$/gm;
    const result = regex.exec(input);

    if (result == null) {
      throw new Error(`faild parse Angle string:'${input}'`);
    }
    let numerator = parseFloat(result[1]);
    if (result[2]) {
      numerator /= parseFloat(result[2]);
    }
    let unit: string = result[3];
    if (unit == null) {
      unit = "d";
    }
    if (unit === "r" || unit === "rad") {
      return numerator;
    }
    if (unit === "p" || unit === "prad") {
      return numerator * Math.PI;
    }
    return numerator / 180 * Math.PI;
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
    const reg1 = /^ *(x|y|z) *\(([^\(\)]+)\) *$/gm;
    const reg2 = /^ *axis *\(([^\(\),]+),([^\(\),]+),([^\(\),]+),([^\(\),]+)\) *$/gm;
    const reg3 = /^ *([^\(\),]+),([^\(\),]+),([^\(\),]+) *$/gm;
    const result = reg1.exec(input);
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
    }
    const res2 = reg2.exec(input);
    if (res2) {
      let rotation = AttributeParser.parseAngle(res2[1]);
      let x = parseFloat(res2[2]);
      let y = parseFloat(res2[3]);
      let z = parseFloat(res2[4]);
      return Quaternion.angleAxis(rotation, new Vector3(x, y, z));
    }
    const res3 = reg3.exec(input);
    if (res3) {
      return Quaternion.euler(AttributeParser.parseAngle(res3[1]), AttributeParser.parseAngle(res3[2]), AttributeParser.parseAngle(res3[3]));
    }
    throw new Error(`Unknown format for rotation3D:'${input}'`);
  }
}

export default AttributeParser;
