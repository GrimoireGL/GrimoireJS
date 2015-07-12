import Geometry = require('../../Core/Geometries/Geometry');
import PrimitiveTopology = require('../../Wrapper/PrimitiveTopology');
import BufferTargetType = require('../../Wrapper/BufferTargetType');
import BufferUsageType = require('../../Wrapper/BufferUsageType');
import ElementType = require('../../Wrapper/ElementType');
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import PMX = require('../PMXLoader');
import ContextManagerBase = require('../../Core/ContextManagerBase');
import Vector3 = require('../../Math/Vector3');
import Buffer = require('../../Core/Resources/Buffer/Buffer');
import Material = require('../../Core/Materials/Material');
import PMXMaterial = require('./PMXMaterial');
class PMXGeometry extends Geometry {
    constructor(pmx: PMX) {
        super();
        var name = "pmxtest";
        var j3 = JThreeContextProxy.getJThreeContext();
        this.primitiveTopology = PrimitiveTopology.Triangles;
        this.indexBuffer = j3.ResourceManager.createBuffer(name + "-index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedInt);
        this.positionBuffer = j3.ResourceManager.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = j3.ResourceManager.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = j3.ResourceManager.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.updateBuffers(pmx);
    }
	
    /**
     * apply pmx geometries to buffer.
     */
    protected updateBuffers(pmx: PMX): void {//TODO use unsigned short
        var surfaceBuffer = new Uint32Array(pmx.Surfaces);
        var positionBuffer = new Float32Array(pmx.Verticies.positions);
        this.indexBuffer.update(surfaceBuffer, surfaceBuffer.length);
        this.normalBuffer.update(new Float32Array(pmx.Verticies.normals), pmx.Verticies.normals.length);
        this.uvBuffer.update(new Float32Array(pmx.Verticies.uvs), pmx.Verticies.uvs.length);
        this.positionBuffer.update(positionBuffer, positionBuffer.length);
    }

    public drawElements(context: ContextManagerBase, material: Material) {
        var mat = <PMXMaterial>material;
        if (mat==null||!mat.VerticiesCount) {
            context.Context.DrawElements(this.PrimitiveTopology, this.IndexBuffer.Length, this.IndexBuffer.ElementType, 0);
            return;
        }
        if(mat.Diffuse.A <0.01)return;
        context.Context.DrawElements(this.PrimitiveTopology, mat.VerticiesCount, this.IndexBuffer.ElementType, mat.VerticiesOffset*4);
    }
}

export =PMXGeometry;