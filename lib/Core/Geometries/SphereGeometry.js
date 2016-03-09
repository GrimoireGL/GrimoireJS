import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class SphereGeometry extends BasicGeometry {
    constructor(name) {
        super();
        this._divideCount = 10;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }
    get DivideCount() {
        return this._divideCount;
    }
    set DivideCount(count) {
        this._divideCount = count;
        this.__updateBuffers();
    }
    __updateBuffers() {
        const pos = [];
        const normal = [];
        const uv = [];
        const index = [];
        GeometryBuilder.addSphere(pos, normal, uv, index, 8, 24, new Vector3(0, 0, 0));
        // GeometryBuilder.addCylinder(pos,normal,uv,index,this.DivideCount,new Vector3(0,1,0),new Vector3(0,-1,0),new Vector3(0,0,-1),1);
        this.indexBuffer.update(new Uint16Array(index), index.length);
        this.normalBuffer.update(new Float32Array(normal), normal.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
    }
}
export default SphereGeometry;
