import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import Matrix = require("../../../Math/Matrix");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Scene = require("../../Scene");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import Program = require("../../Resources/Program/Program");
import UniformRegisterBase = require("./UniformRegisterBase");
import Delegates = require("../../../Base/Delegates");
declare type MaterialConfigureFunc = Delegates.Action7<ProgramWrapper, Scene, BasicRenderer, SceneObject, ResolvedChainInfo, number, number>;

class BasicMaterixRegister extends UniformRegisterBase {
    public getRegisterFunction(prog: Program): MaterialConfigureFunc {
        return (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matMVP": {
                        type: "matrix",
                        value: object.Transformer.calculateMVPMatrix(renderer)
                    },
                    "matMV": {
                        type: "matrix",
                        value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal)
                    },
                    "matM":
                    {
                        type: "matrix",
                        value: object.Transformer.LocalToGlobal
                    },
                    "matV":
                    {
                        type: "matrix",
                        value: renderer.Camera.viewMatrix
                    },
                    "matP":
                    {
                        type: "matrix",
                        value: renderer.Camera.projectionMatrix
                    }
                }
            }
            );
        }
    }
}
