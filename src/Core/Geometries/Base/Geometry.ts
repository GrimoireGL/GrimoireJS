import NamedValue from "../../../Base/NamedValue";
import IDisposable from "../../../Base/IDisposable";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import IDObject from "../../../Base/IDObject";
import Buffer from "./../../Resources/Buffer/Buffer";
import Canvas from "./../../Canvas/Canvas";
import Material from "./../../Materials/Material";
/**
 * Base abstraction for geometry.
 */
abstract class Geometry extends IDObject implements IDisposable {
  public static lastGeometry: Geometry = null;

  public static lastProgram: ProgramWrapper = null;

  public primitiveTopology: number = WebGLRenderingContext.TRIANGLES;
  public get GeometryOffset() {
    return 0;
  }

  public abstract drawElements(canvas: Canvas, material: Material): void;

  public abstract drawWireframe(canvas: Canvas, material: Material): void;

  protected abstract __applyAttributeVariables(pWrapper: ProgramWrapper, attributes: NamedValue<IVariableDescription>): void;

  public useGeometry(pWrapper: ProgramWrapper, attributes: NamedValue<IVariableDescription>): void {
    if (Geometry.lastGeometry !== this || Geometry.lastProgram !== pWrapper) {
      this.__applyAttributeVariables(pWrapper, attributes);
      Geometry.lastGeometry = this;
      Geometry.lastProgram = pWrapper;
    }
  }

  protected __assignAttributeIfExists(pWrapper: ProgramWrapper, attributes: NamedValue<IVariableDescription>, valName: string, buffer: Buffer): void {
    if (attributes[valName]) {
      pWrapper.assignAttributeVariable(valName, buffer);
    }
  }

  public abstract getDrawLength(): number;

  public abstract dispose(): void;

}
export default Geometry;
