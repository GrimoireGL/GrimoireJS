import Vector4 from "../../Math/Vector4";
import Vector3 from "../../Math/Vector3";
class PMXMaterialMorphParamContainer {
    constructor(calcFlag) {
        this._calcFlag = calcFlag;
        const def = 1 - calcFlag;
        this.diffuse = [def, def, def, def];
        this.specular = [def, def, def, def];
        this.ambient = [def, def, def];
        this.edgeColor = [def, def, def, def];
        this.edgeSize = def;
        this.textureCoeff = [def, def, def, def];
        this.sphereCoeff = [def, def, def, def];
        this.toonCoeff = [def, def, def, def];
    }
    static calcMorphedSingleValue(base, add, mul, target) {
        return base * target(mul) + target(add);
    }
    static calcMorphedVectorValue(base, add, mul, target, vecLength) {
        switch (vecLength) {
            case 3:
                return new Vector3(base.X * target(mul)[0] + target(add)[0], base.Y * target(mul)[1] + target(add)[1], base.Z * target(mul)[2] + target(add)[2]);
            case 4:
                return new Vector4(base.X * target(mul)[0] + target(add)[0], base.Y * target(mul)[1] + target(add)[1], base.Z * target(mul)[2] + target(add)[2], base.W * target(mul)[3] + target(add)[3]);
        }
    }
}
export default PMXMaterialMorphParamContainer;
