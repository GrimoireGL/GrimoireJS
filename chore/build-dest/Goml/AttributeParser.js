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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvQXR0cmlidXRlUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLFlBQVksTUFBTSxzQkFBc0I7T0FDeEMsVUFBVSxNQUFNLG9CQUFvQjtPQUNwQyxPQUFPLE1BQU0saUJBQWlCO0FBQ3JDOztHQUVHO0FBQ0gsOEJBQThCLFlBQVk7SUFDeEM7Ozs7OztPQU1HO0lBQ0gsT0FBYyxVQUFVLENBQUMsS0FBYTtRQUNwQyxNQUFNLEtBQUssR0FBRyx3R0FBd0csQ0FBQztRQUN2SCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsU0FBUyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksR0FBRyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsQ0FB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bGUiOiJHb21sL0F0dHJpYnV0ZVBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqVGhyZWVPYmplY3QgZnJvbSBcIi4uL0Jhc2UvSlRocmVlT2JqZWN0XCI7XG5pbXBvcnQgUXVhdGVybmlvbiBmcm9tIFwiLi4vTWF0aC9RdWF0ZXJuaW9uXCI7XG5pbXBvcnQgVmVjdG9yMyBmcm9tIFwiLi4vTWF0aC9WZWN0b3IzXCI7XG4vKipcbiAqIFV0aWxpdHkgY2xhc3MgdG8gcGFyc2UgdGhlIGFyZ3VtZW50cyBvZiBhdHRyaWJ1dGVzLlxuICovXG5jbGFzcyBBdHRyaWJ1dGVQYXJzZXIgZXh0ZW5kcyBqVGhyZWVPYmplY3Qge1xuICAvKipcbiAgICogUGFyc2UgYW5nbGUgc3RyaW5ncy5cbiAgICogXCJwXCIgbWVhbnMgUGkuIEV4KSAzLzQgcFxuICAgKiBcImRcIiBtZWFucyBkZWdyZWUuIGlmIHRoaXMgdW5pdCB3YXMgc3BlY2lmaWVkLCB0aGUgYXJndW1lbnQgd2lsbCBiZSBwYXJzZWQgYXMgZGVncmVlLiBFeCkgOTBkXG4gICAqIEBwYXJhbSBpbnB1dCB0aGUgc3RyaW5nIHRvIHBhcnNlLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBwYXJzZWQgYW5nbGUgaW4gcmFkaWFucy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VBbmdsZShpbnB1dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBjb25zdCByZWdleCA9IC9eICooLT8gKig/OjB8WzEtOV1cXGQqKSg/OiAqXFwuXFxkKyk/KSAqKD86XFwvICooKD86MHxbMS05XVxcZCopKD86ICpcXC5cXGQrKT8pKT8gKihwfHByYWR8ZGVnfGR8cnxyYWQpPyAqJC9nbTtcbiAgICBjb25zdCByZXN1bHQgPSByZWdleC5leGVjKGlucHV0KTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBmYWlsZCBwYXJzZSBBbmdsZSBzdHJpbmc6JyR7aW5wdXR9J2ApO1xuICAgIH1cbiAgICBsZXQgbnVtZXJhdG9yID0gcGFyc2VGbG9hdChyZXN1bHRbMV0pO1xuICAgIGlmIChyZXN1bHRbMl0pIHtcbiAgICAgIG51bWVyYXRvciAvPSBwYXJzZUZsb2F0KHJlc3VsdFsyXSk7XG4gICAgfVxuICAgIGxldCB1bml0OiBzdHJpbmcgPSByZXN1bHRbM107XG4gICAgaWYgKHVuaXQgPT0gbnVsbCkge1xuICAgICAgdW5pdCA9IFwiZFwiO1xuICAgIH1cbiAgICBpZiAodW5pdCA9PT0gXCJyXCIgfHwgdW5pdCA9PT0gXCJyYWRcIikge1xuICAgICAgcmV0dXJuIG51bWVyYXRvcjtcbiAgICB9XG4gICAgaWYgKHVuaXQgPT09IFwicFwiIHx8IHVuaXQgPT09IFwicHJhZFwiKSB7XG4gICAgICByZXR1cm4gbnVtZXJhdG9yICogTWF0aC5QSTtcbiAgICB9XG4gICAgcmV0dXJuIG51bWVyYXRvciAvIDE4MCAqIE1hdGguUEk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYW5nbGUgc3RyaW5nIGluIDNELlxuICAgKiBcInBcIiBtZWFucyBQaS4gRXgpIDMvNCBwXG4gICAqIFwiZFwiIG1lYW5zIGRlZ3JlZS4gaWYgdGhpcyB1bml0IHdhcyBzcGVjaWZpZWQsIHRoZSBhcmd1bWVudCB3aWxsIGJlIHBhcnNlZCBhcyBkZWdyZWUuIEV4KSA5MGRcbiAgICogXCJldWxhcih4LHkseilcIiBtZWFucyByb3RhdGlvbiBpbiBldWxhci4gVGhpcyBtZWFucyBaLVgtWSByb3RhdGlvbiBsaWtlIFVuaXR5LlxuICAgKiBcImF4aXMoYW5nbGUseCx5LHopXCIgbWVhbnMgcm90YXRpb24gYXJvdW5kIHNwZWNpZmllZCBheGlzLiBUaGlzIG1lYW5zIGFuZ2xlIHJhZGlhbnMgd2lsbCBiZSByb3RhdGVkIGFyb3VuZCB0aGUgYXhpcyAoeCx5LHopLlxuICAgKiBUaGlzIGFuZ2xlIGNhbiBiZSBzcGVjaWZpZWQgd2l0aCB0aGUgY2hhcmFjdGVyIFwicFwiIG9yIFwiZFwiLlxuICAgKiBcIngoYW5nbGUpXCIsXCJ5KGFuZ2xlKVwiIG9yIFwieihhbmdsZSlcIiBtZWFucyByb3RhdGlvbiBhcm91bmQgdW5pdCBheGlzLlxuICAgKiBUaGlzIGFuZ2xlIGNhbiBiZSBzcGVjaWZpZWQgd2l0aCB0aGUgY2hhcmFjdGVyIFwicFwiIG9yIFwiZFwiLlxuICAgKiBAcGFyYW0gaW5wdXQgdGhlIHN0cmluZyB0byBiZSBwYXJzZWQgYXMgYW5nbGUgaW4gM0QuXG4gICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBwYXJzZWQgcm90YXRpb24gaW4gUXVhdGVybmlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VSb3RhdGlvbjNEKGlucHV0OiBzdHJpbmcpOiBRdWF0ZXJuaW9uIHtcbiAgICBjb25zdCByZWcxID0gL14gKih4fHl8eikgKlxcKChbXlxcKFxcKV0rKVxcKSAqJC9nbTtcbiAgICBjb25zdCByZWcyID0gL14gKmF4aXMgKlxcKChbXlxcKFxcKSxdKyksKFteXFwoXFwpLF0rKSwoW15cXChcXCksXSspLChbXlxcKFxcKSxdKylcXCkgKiQvZ207XG4gICAgY29uc3QgcmVnMyA9IC9eICooW15cXChcXCksXSspLChbXlxcKFxcKSxdKyksKFteXFwoXFwpLF0rKSAqJC9nbTtcbiAgICBjb25zdCByZXN1bHQgPSByZWcxLmV4ZWMoaW5wdXQpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHRbMV0gPT09IFwieFwiKSB7XG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhBdHRyaWJ1dGVQYXJzZXIucGFyc2VBbmdsZShyZXN1bHRbMl0pLCBWZWN0b3IzLlhVbml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHRbMV0gPT09IFwieVwiKSB7XG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhBdHRyaWJ1dGVQYXJzZXIucGFyc2VBbmdsZShyZXN1bHRbMl0pLCBWZWN0b3IzLllVbml0KTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHRbMV0gPT09IFwielwiKSB7XG4gICAgICAgIHJldHVybiBRdWF0ZXJuaW9uLmFuZ2xlQXhpcyhBdHRyaWJ1dGVQYXJzZXIucGFyc2VBbmdsZShyZXN1bHRbMl0pLCBWZWN0b3IzLlpVbml0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzMiA9IHJlZzIuZXhlYyhpbnB1dCk7XG4gICAgaWYgKHJlczIpIHtcbiAgICAgIGxldCByb3RhdGlvbiA9IEF0dHJpYnV0ZVBhcnNlci5wYXJzZUFuZ2xlKHJlczJbMV0pO1xuICAgICAgbGV0IHggPSBwYXJzZUZsb2F0KHJlczJbMl0pO1xuICAgICAgbGV0IHkgPSBwYXJzZUZsb2F0KHJlczJbM10pO1xuICAgICAgbGV0IHogPSBwYXJzZUZsb2F0KHJlczJbNF0pO1xuICAgICAgcmV0dXJuIFF1YXRlcm5pb24uYW5nbGVBeGlzKHJvdGF0aW9uLCBuZXcgVmVjdG9yMyh4LCB5LCB6KSk7XG4gICAgfVxuICAgIGNvbnN0IHJlczMgPSByZWczLmV4ZWMoaW5wdXQpO1xuICAgIGlmIChyZXMzKSB7XG4gICAgICByZXR1cm4gUXVhdGVybmlvbi5ldWxlcihBdHRyaWJ1dGVQYXJzZXIucGFyc2VBbmdsZShyZXMzWzFdKSwgQXR0cmlidXRlUGFyc2VyLnBhcnNlQW5nbGUocmVzM1syXSksIEF0dHJpYnV0ZVBhcnNlci5wYXJzZUFuZ2xlKHJlczNbM10pKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZvcm1hdCBmb3Igcm90YXRpb24zRDonJHtpbnB1dH0nYCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXR0cmlidXRlUGFyc2VyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
