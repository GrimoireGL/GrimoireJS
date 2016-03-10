import jThreeObject from "../Base/JThreeObject";
import Quaternion from "../Math/Quaternion";
import Vector3 from "../Math/Vector3";
class AttributeParser extends jThreeObject {
    static parseAngle(input) {
        const regex = /^ *(-? *(?:0|[1-9]\d*)(?: *\.\d+)?) *(?:\/ *((?:0|[1-9]\d*)(?: *\.\d+)?))? *(p|prad|deg|d|r|rad)? *$/gm;
        const result = regex.exec(input);
        if (result == null) {
            throw new Error(`faild parse Angle string:'${input}'`);
        }
        let numerator = parseFloat(result[1]);
        if (result[2]) {
            numerator /= parseFloat(result[2]);
        }
        let unit = result[3];
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
    static parseRotation3D(input) {
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
//# sourceMappingURL=AttributeParser.js.map