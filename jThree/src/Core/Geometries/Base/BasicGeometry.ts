import IVariableInfo = require("../../Materials/Base/IVariableInfo");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import IndexedGeometry = require("./IndexedGeometry");
import PrimitiveTopology = require("../../../Wrapper/PrimitiveTopology");
import Buffer = require("../../Resources/Buffer/Buffer");
/**
 * Basic geometry for builtin primitives. This geometry contains position,normal,uv as buffer.
 *
 * ビルトインのプリミティブのためのジオメトリ、このジオメトリはposition,normal,uvをバッファとして持つ。
 * @type {[type]}
 */
class BasicGeometry extends IndexedGeometry
{
  /**
   * positions of the verticies.
   * @type {Buffer}
   */
  public positionBuffer: Buffer;
  /**
   * normals of the verticies.
   * @type {Buffer}
   */
  public normalBuffer: Buffer;
  /**
   * uvs of the verticies.
   * @type {Buffer}
   */
  public uvBuffer: Buffer;

  public applyAttributeVariables(pWrapper: ProgramWrapper, attributes: { [key: string]: IVariableInfo }): void {
    this.__assignAttributeIfExists(pWrapper,attributes,"position",this.positionBuffer);
    this.__assignAttributeIfExists(pWrapper,attributes,"normal",this.normalBuffer);
    this.__assignAttributeIfExists(pWrapper,attributes,"uv",this.uvBuffer);
 }
}

export = BasicGeometry;
