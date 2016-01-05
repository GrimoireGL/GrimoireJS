import Material = require("../Materials/Material");
import Canvas = require("../Canvas");
import Geometry = require("./Geometry");
import Buffer = require("../Resources/Buffer/Buffer");
class IndexedGeometry extends Geometry
{
    protected __indexBuffer: Buffer;

    public get IndexBuffer(): Buffer {
        return this.__indexBuffer;
    }

    /**
     * 3 times of surface count.
     */
    public get IndexCount() {
        return this.__indexBuffer.Length;
    }

    public drawElements(canvas: Canvas, material: Material) {
      this.bindIndexBuffer(canvas);
        if (material) {
            canvas.GL.drawElements(this.PrimitiveTopology, material.getDrawGeometryLength(this), this.IndexBuffer.ElementType, material.getDrawGeometryOffset(this));
            return;
        }
        canvas.GL.drawElements(this.PrimitiveTopology, this.IndexCount, this.IndexBuffer.ElementType, this.GeometryOffset);
    }

    public bindIndexBuffer(canvas: Canvas) {
        this.__indexBuffer.getForContext(canvas).bindBuffer();
    }
}

export = IndexedGeometry;
