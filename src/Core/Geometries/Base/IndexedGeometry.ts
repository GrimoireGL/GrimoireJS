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

  public dispose(): void {
    this.indexBuffer.dispose();
  }

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
    canvas.gl.drawElements(this.primitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
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
          canvas.gl.drawElements(WebGLRenderingContext.POINTS, 3, this.indexBuffer.ElementType, index);
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
    this.indexBuffer.getForGL(canvas.gl).bindBuffer();
  }

  protected __updateIndexBuffer(indicies: number[], length: number): void {
    let format = WebGLRenderingContext.UNSIGNED_INT;
    let arrayConstructor: new (arr: number[]) => ArrayBufferView = Uint32Array;
    if (length < 256) {
      format = WebGLRenderingContext.UNSIGNED_BYTE;
      arrayConstructor = Uint8Array;
    } else if (length < 65535) {
      format = WebGLRenderingContext.UNSIGNED_SHORT;
      arrayConstructor = Uint16Array;
    } else if (length >= 4294967296) {
      throw new Error("Too many index of geometry!");
    }

    this.indexBuffer.update(new arrayConstructor(indicies), length);
    this.indexBuffer.ElementType = format;
  }
}

export default IndexedGeometry;
