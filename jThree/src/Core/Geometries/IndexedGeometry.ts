import Material = require("../Materials/Material");
import Canvas = require("../Canvas");
import Geometry = require("./Geometry");
import Buffer = require("../Resources/Buffer/Buffer");
abstract class IndexedGeometry extends Geometry
{
    public indexBuffer: Buffer;

    /**
     * 3 times of surface count.
     */
    public get IndexCount() {
        return this.indexBuffer.Length;
    }

    public drawElements(canvas: Canvas, material: Material) {
      this.bindIndexBuffer(canvas);
        if (material) {
            canvas.GL.drawElements(this.PrimitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
            return;
        }
        canvas.GL.drawElements(this.PrimitiveTopology, this.IndexCount, this.indexBuffer.ElementType, this.GeometryOffset);
    }

    public bindIndexBuffer(canvas: Canvas) {
        this.indexBuffer.getForContext(canvas).bindBuffer();
    }
}

export = IndexedGeometry;
