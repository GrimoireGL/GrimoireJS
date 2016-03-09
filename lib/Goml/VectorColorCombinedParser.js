import Vector4 from "../Math/Vector4";
import Color4 from "../Math/Color4";
import Vector3 from "../Math/Vector3";
import Color3 from "../Math/Color3";
class VectorColorCombinedParser {
    static parseTuple3(source) {
        const asColor = Color3.parse(source);
        if (typeof asColor !== "undefined") {
            return asColor;
        }
        return Vector3.parse(source);
    }
    static parseTuple4(source) {
        const asColor = Color4.parse(source);
        if (typeof asColor !== "undefined") {
            return asColor;
        }
        return Vector4.parse(source);
    }
}
export default VectorColorCombinedParser;
