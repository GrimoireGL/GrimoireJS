import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
import BasicMaterial = require("../Base/BasicMaterial");
class PrimaryBufferMaterial extends BasicMaterial
{
  constructor()
  {
    super(require("../BuiltIn/GBuffer/PrimaryBuffer.html"));
  }

  public configureMaterial(matArg:IMaterialConfigureArgument): void
  {
    var geometry = matArg.object.Geometry;
    var fm = matArg.object.getMaterial("jthree.materials.forematerial");//brightness
    var brightness = 0;
    const fmArgs = fm.materialVariables;
    if(fmArgs["brightness"])brightness = fmArgs["brightness"];
    this.materialVariables["brightness"] = brightness;
    super.configureMaterial(matArg);
  }
}

export = PrimaryBufferMaterial;
