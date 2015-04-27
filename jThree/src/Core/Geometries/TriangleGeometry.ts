import JThreeObject=require('Base/JThreeObject');
import Geometry = require("../Geometry");
import JThreeContextProxy = require("../JThreeContextProxy");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import JthreeID = require("../../Base/JThreeID");
class TriangleGeometry extends Geometry {
    constructor() {
        super();
        var j3=JThreeContextProxy.getJThreeContext();
        this.positionBuffer = j3.ResourceManager.createBuffer("triangle-geometry"+JthreeID.getUniqueRandom(10), BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.positionBuffer.update(new Float32Array([0.0, 1, 0.2,
            1.0, 0.0, 0.2,
            -1.0, 0.0, 0.2]), 9);
        this.normalBuffer = j3.ResourceManager.createBuffer("triangle-normals"+JthreeID.getUniqueRandom(10), BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer.update(new Float32Array([0,1,-1,1,0,-1,-1,0,-1]),9);
    }
}

export=TriangleGeometry;
