import JThreeObject = require('Base/JThreeObject');
import Geometry = require("./Geometry");
import JThreeContextProxy = require("../JThreeContextProxy");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import JthreeID = require("../../Base/JThreeID");
import Buffer = require("../Resources/Buffer/Buffer");
import Vector3 = require("../../Math/Vector3");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
class CubeGeometry extends Geometry {
    constructor(name: string) {
        super();
        var j3 = JThreeContextProxy.getJThreeContext();
        this.primitiveTopology = PrimitiveTopology.Triangles;
        this.indexBuffer = j3.ResourceManager.createBuffer(name + "index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedByte);
        this.positionBuffer = j3.ResourceManager.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = j3.ResourceManager.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = j3.ResourceManager.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.updateBuffers();
    }


    protected updateBuffers(): void {
    var pos: number[] = [];
    var normal: number[] = [];
    var uv: number[] = [];
    var index: number[] = [];
    this.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, 1), new Vector3(1, 1, 1), new Vector3(-1, -1, 1)]);
    this.addQuad(pos, normal, uv, index, [new Vector3(1, 1, 1), new Vector3(1, 1, -1), new Vector3(1, -1, 1)]);
    this.addQuad(pos, normal, uv, index, [new Vector3(1, 1, -1), new Vector3(-1, 1, -1), new Vector3(1, -1, -1)]);
    this.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, -1), new Vector3(-1, 1, 1), new Vector3(-1, -1, -1)]);
    this.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, 1), new Vector3(-1, 1, -1), new Vector3(1, 1, 1)]);
    this.addQuad(pos, normal, uv, index, [new Vector3(1, -1, 1), new Vector3(1, -1, -1), new Vector3(-1, -1, 1)]);
    this.indexBuffer.update(new Uint8Array(index), index.length);
    this.normalBuffer.update(new Float32Array(normal), normal.length);
    this.uvBuffer.update(new Float32Array(uv), uv.length);
    this.positionBuffer.update(new Float32Array(pos), pos.length);
    }

  public drawElements(contextManager, material) {
    super.drawElements(contextManager, material);
  }

}

export =CubeGeometry;
