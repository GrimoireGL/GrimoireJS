import BasicMaterial = require("../Base/BasicMaterial");
import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
import IMaterialConfig = require("../IMaterialConfig");
import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Matrix = require("../../../Math/Matrix");
import Vector4 = require("../../../Math/Vector4");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class HitAreaMaterial extends BasicMaterial {
    constructor() {
        super(require("../BuiltIn/HitAreaTest.html"));
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        var r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
        var g = 0x00FF & (matArg.renderStage as any).___objectIndex;
        this.materialVariables["indexColor"] = new Vector4(r /0xFF,  g/0xFF, 0, 1);
        super.configureMaterial(matArg);
    }
}

export =HitAreaMaterial;
