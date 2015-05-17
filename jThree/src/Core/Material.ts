import JThreeObjectWithId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./RendererBase");
import SceneObject = require("./SceneObject");
class Material extends JThreeObjectWithId
{

    constructor() {
        super();

    }

    private priorty: number;

    get Priorty(): number {
        return this.priorty;
    }

    configureMaterial(renderer:RendererBase,geometry:SceneObject): void {
        return;
    }
}

export=Material;
