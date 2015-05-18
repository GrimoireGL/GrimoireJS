import JThreeObjectWithId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./RendererBase");
import SceneObject = require("./SceneObject");
import Matrix = require("../Math/Matrix");
class Material extends JThreeObjectWithId
{

    constructor() {
        super();

    }

    private priorty: number;

    get Priorty(): number {
        return this.priorty;
    }

    configureMaterial(renderer:RendererBase,object:SceneObject): void {
        return;
    }

/**
* Calculate MVP(Model-View-Projection) matrix
*/
    protected CalculateMVPMatrix(renderer:RendererBase,object:SceneObject):Matrix
    {
      return Matrix.multiply(Matrix.multiply(renderer.Camera.ProjectionMatrix,renderer.Camera.ViewMatrix),object.Transformer.LocalToGlobal);
    }
}

export=Material;
