"use strict";
const Geometry_1 = require("./Geometry");
class IndexedGeometry extends Geometry_1.default {
    getDrawLength() {
        return this.indexBuffer.Length;
    }
    drawElements(canvas, material) {
        this.__bindIndexBuffer(canvas);
        canvas.gl.drawElements(this.primitiveTopology, material.getDrawGeometryLength(this), this.indexBuffer.ElementType, material.getDrawGeometryOffset(this));
    }
    drawWireframe(canvas, material) {
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
    __bindIndexBuffer(canvas) {
        this.indexBuffer.getForContext(canvas).bindBuffer();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexedGeometry;
//# sourceMappingURL=IndexedGeometry.js.map