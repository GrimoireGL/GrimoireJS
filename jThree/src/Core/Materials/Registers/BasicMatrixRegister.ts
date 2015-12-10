import Matrix = require("../../../Math/Matrix");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Scene = require("../../Scene");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import Program = require("../../Resources/Program/Program");
import UniformRegisterBase = require("./UniformRegisterBase");
class BasicMaterixRegister extends UniformRegisterBase {
    public initializeForProgram(program: Program) {
        this.__addChildFunctionIfVariableExist(program, "matMVP", (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matMVP": {
                        type: "matrix",
                        value: object.Transformer.calculateMVPMatrix(renderer)
                    }
                }
            });
        });
        this.__addChildFunctionIfVariableExist(program, "matMV", (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matMV": {
                        type: "matrix",
                        value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal)
                    }
                }
            });
        });
        this.__addChildFunctionIfVariableExist(program, "matM", (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matM": {
                        type: "matrix",
                        value: object.Transformer.LocalToGlobal
                    }
                }
            });
        });
        this.__addChildFunctionIfVariableExist(program, "matV", (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matV": {
                        type: "matrix",
                        value: renderer.Camera.viewMatrix
                    }
                }
            });
        });
        this.__addChildFunctionIfVariableExist(program, "matP", (wrapper: ProgramWrapper, scene: Scene, renderer: BasicRenderer, object: SceneObject) => {
            wrapper.register({
                uniforms: {
                    "matP": {
                        type: "matrix",
                        value: renderer.Camera.projectionMatrix
                    }
                }
            });
        });
    }
}
