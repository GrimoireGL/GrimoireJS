import IVariableDescription = require("../../Materials/Base/IVariableDescription");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import jThreeObject = require("../../../Base/JThreeObject");
import Buffer = require("./../../Resources/Buffer/Buffer");
import PrimitiveTopology = require("../../../Wrapper/PrimitiveTopology");
import Canvas = require("./../../Canvas");
import Material = require("./../../Materials/Material");
/**
 * Base abstraction for geometry.
 */
abstract class Geometry extends jThreeObject {
    public primitiveTopology: PrimitiveTopology = PrimitiveTopology.Triangles;
    public get GeometryOffset() {
        return 0;
    }

    public abstract drawElements(canvas: Canvas, material: Material);

    public abstract applyAttributeVariables(pWrapper: ProgramWrapper, attributes: { [key: string]: IVariableDescription }): void;

    protected __assignAttributeIfExists(pWrapper: ProgramWrapper, attributes: { [key: string]: IVariableDescription }, valName: string, buffer: Buffer): void {
        if (attributes[valName]) {
            pWrapper.assignAttributeVariable(valName, buffer);
        }
    }

    public abstract getDrawLength(): number;

}
export = Geometry;
