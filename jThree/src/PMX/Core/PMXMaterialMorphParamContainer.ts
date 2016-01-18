import Vector4 = require("../../Math/Vector4");
import Vector3 = require("../../Math/Vector3");
import Delegates = require("../../Base/Delegates");
<<<<<<< Updated upstream

class PMXMaterialMorphParamContainer
{
    constructor(calcFlag: number)
    {
        this.calcFlag = calcFlag;
        var def = 1 - calcFlag;
        this.diffuse = [def, def, def, def];
        this.specular = [def, def, def, def];
        this.ambient = [def, def, def];
        this.edgeColor = [def, def, def, def];
        this.edgeSize = def;
        this.textureCoeff = [def, def, def, def];
        this.sphereCoeff = [def, def, def, def];
        this.toonCoeff = [def, def, def, def];
    }
=======
>>>>>>> Stashed changes

class PMXMaterialMorphParamContainer {
  constructor(calcFlag: number) {
    this.calcFlag = calcFlag;
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

  private calcFlag: number;

  public diffuse: number[];

  public specular: number[];

  public ambient: number[];

  public edgeColor: number[];

  public edgeSize: number;

  public textureCoeff: number[];

  public sphereCoeff: number[];

  public toonCoeff: number[];

  public static calcMorphedSingleValue(base: number, add: PMXMaterialMorphParamContainer, mul: PMXMaterialMorphParamContainer, target: Delegates.Func1<PMXMaterialMorphParamContainer, number>) {
    return base * target(mul) + target(add);
  }

  public static calcMorphedVectorValue(base: Vector4|Vector3, add: PMXMaterialMorphParamContainer, mul: PMXMaterialMorphParamContainer, target: Delegates.Func1<PMXMaterialMorphParamContainer, number[]>, vecLength: number): Vector3|Vector4 {
    switch (vecLength) {
      case 3:
        return new Vector3(base.X * target(mul)[0] + target(add)[0],
          base.Y * target(mul)[1] + target(add)[1],
          base.Z * target(mul)[2] + target(add)[2]);
      case 4:
        return new Vector4(base.X * target(mul)[0] + target(add)[0],
          base.Y * target(mul)[1] + target(add)[1],
          base.Z * target(mul)[2] + target(add)[2],
          (<Vector4>base).W * target(mul)[3] + target(add)[3]
          );
    }
  }
}

export = PMXMaterialMorphParamContainer;
