import JThreeObjectWithId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./RendererBase");
import Geometry = require("./Geometry");
class Material extends JThreeObjectWithId
{

    constructor() {
        super();

    }

    private priorty: number;

    get Priorty(): number {
        return this.priorty;
    }

    configureMaterial(renderer:RendererBase,geometry:Geometry): void {
        return;
    }
}

export=Material;
