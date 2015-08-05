import Geometry = require('../../Core/Geometries/Geometry');
import PrimitiveTopology = require('../../Wrapper/PrimitiveTopology');
import BufferTargetType = require('../../Wrapper/BufferTargetType');
import BufferUsageType = require('../../Wrapper/BufferUsageType');
import ElementType = require('../../Wrapper/ElementType');
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import PMX = require('../PMXLoader');
import Buffer = require('../../Core/Resources/Buffer/Buffer');

class PMXGeometry extends Geometry {

    public edgeSizeBuffer: Buffer;

    public boneIndexBuffer: Buffer;

    public boneWeightBuffer: Buffer;

    public positionBuferSource: Float32Array;

    public uvBufferSource: Float32Array;

    constructor(pmx: PMX) {
        super();
        var name = "pmxtest";
        var j3 = JThreeContextProxy.getJThreeContext();
        this.primitiveTopology = PrimitiveTopology.Triangles;
        this.indexBuffer = j3.ResourceManager.createBuffer(name + "-index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedInt);
        this.positionBuffer = j3.ResourceManager.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = j3.ResourceManager.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = j3.ResourceManager.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.edgeSizeBuffer = j3.ResourceManager.createBuffer(name + "-edgeSize", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.Float);
        this.boneIndexBuffer = j3.ResourceManager.createBuffer(name + "-boneIndex", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 4, ElementType.Float);
        this.boneWeightBuffer = j3.ResourceManager.createBuffer(name + "-boneWeight", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 4, ElementType.Float);
        this.updateBuffers(pmx);
    }
	
    /**
     * apply pmx geometries to buffer.
     */
    protected updateBuffers(pmx: PMX): void {//TODO use unsigned short
        var surfaceBuffer = new Uint32Array(pmx.Surfaces);
        var verticies = pmx.Verticies;
        this.positionBuferSource = new Float32Array(verticies.positions);
        this.uvBufferSource = new Float32Array(verticies.uvs);
        this.indexBuffer.update(surfaceBuffer, surfaceBuffer.length);
        this.normalBuffer.update(verticies.normals,verticies.normals.length);
        this.uvBuffer.update(this.uvBufferSource, this.uvBufferSource.length);
        this.positionBuffer.update(this.positionBuferSource, this.positionBuferSource.length);
        this.edgeSizeBuffer.update(verticies.edgeScaling, verticies.edgeScaling.length)
        this.boneIndexBuffer.update(verticies.boneIndicies, verticies.boneIndicies.length)
        this.boneWeightBuffer.update(verticies.boneWeights, verticies.boneWeights.length)
    }

    public updatePositionBuffer() {
        this.positionBuffer.update(this.positionBuferSource, this.positionBuferSource.length);
    }

    public updateUVBuffer() {
        this.uvBuffer.update(this.uvBufferSource, this.uvBufferSource.length);
    }
}

export =PMXGeometry;