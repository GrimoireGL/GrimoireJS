import IVariableDescription from "../../Materials/Base/IVariableDescription";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import jThreeObject from "../../../Base/JThreeObject";
import Buffer from "./../../Resources/Buffer/Buffer";
import PrimitiveTopology from "../../../Wrapper/PrimitiveTopology";
import Canvas from "./../../Canvas";
import Material from "./../../Materials/Material";
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
export default Geometry;
