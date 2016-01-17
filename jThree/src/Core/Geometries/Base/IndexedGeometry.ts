import Canvas = require("../../Canvas");
import Material = require("../../Materials/Material");
import Geometry = require("./Geometry");
import Buffer = require("../../Resources/Buffer/Buffer");
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
     * Draw this material for specified material.
     *
     * 渡されたマテリアル用にジオメトリを描画します。
     * @param {Canvas}   canvas   the canvas should be rendererd with this method.
     * @param {Material} material the material should be used for rendering this geometry.
     */
    public drawElements(canvas: Canvas, material: Material): void {
        this.__bindIndexBuffer(canvas);
        if (material) {
            canvas.GL.drawElements(this.primitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
            return;
        }
        canvas.GL.drawElements(this.primitiveTopology, this.getDrawLength(), this.indexBuffer.ElementType, this.GeometryOffset);
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

export = IndexedGeometry;
