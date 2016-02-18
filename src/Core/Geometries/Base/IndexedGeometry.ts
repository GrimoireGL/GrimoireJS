import Canvas from "../../Canvas/Canvas";
import Material from "../../Materials/Material";
import Geometry from "./Geometry";
import Buffer from "../../Resources/Buffer/Buffer";
/**
 * The abstract class for the geometries having index buffer(ELEMENT_ARRAY_BUFFER) for drawing.
 *
 * 描画にインデックスバッファ(ELEMENT_ARRAY_BUFFER)を用いるジオメトリの抽象クラス
 */
abstract class IndexedGeometry extends Geometry {
  /**
   * Index buffer used for rendering this Geometry
   *
   * このジオメトリの描画に利用されるインデックスバッファ
   * @type {Buffer}
   */
  public indexBuffer: Buffer;

  /**
   * The count of verticies.(3 times count of surfaces(When the topology was "triangles"))
   *
   * 頂点数(面数の3倍となる(topologyがtrianglesの時))
   * @return {number} The count of verticies
   */
  public getDrawLength(): number {
    return this.indexBuffer.Length;
  }

  /**
   * Draw this geometry for specified material.
   *
   * 渡されたマテリアル用にジオメトリを描画します。
   * @param {Canvas}   canvas   the canvas should be rendererd with this method.
   * @param {Material} material the material should be used for rendering this geometry.
   */
  public drawElements(canvas: Canvas, material: Material): void {
    this.__bindIndexBuffer(canvas);
    canvas.GL.drawElements(this.primitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
  }

  /**
   * Draw this geometry as wireframe for specified material.
   * @param {Canvas}   canvas   [description]
   * @param {Material} material [description]
   */
  public drawWireframe(canvas: Canvas, material: Material): void {
    this.__bindIndexBuffer(canvas);
    const offset = material.getDrawGeometryOffset(this);
    const length = material.getDrawGeometryLength(this);
    let index = offset;
    switch (this.primitiveTopology) {
      case WebGLRenderingContext.TRIANGLES:
        if (length % 3 !== 0) {
          throw new Error("length is invalid!");
        }
        while (offset + length > index) {
          canvas.GL.drawElements(WebGLRenderingContext.POINTS, 3, this.indexBuffer.ElementType, index);
          index += 3;
        }
        break;
      default:
        throw new Error("Unsupported topology!");
    }
  }

  /**
   * Bind the index buffer for specified Canvas
   *
   * 渡されたCanvas用にインデックスバッファをバインドします。
   * @param  {Canvas} canvas the canvas this index buffer should be bound to
   */
  protected __bindIndexBuffer(canvas: Canvas): void {
    this.indexBuffer.getForContext(canvas).bindBuffer();
  }
}

export default IndexedGeometry;
