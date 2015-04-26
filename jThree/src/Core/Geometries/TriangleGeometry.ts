import JThreeObject=require('Base/JThreeObject');
import Geometry = require("../Geometry");
import JThreeContext = require("../JThreeContext");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
class TriangleGeometry extends Geometry {
    constructor() {
        super();
        this.positionBuffer = JThreeContext.getInstance().ResourceManager.createBuffer("triangle-geometry", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.positionBuffer.update(new Float32Array([0.0, 1, 0.2,
            1.0, 0.0, 0.2,
            -1.0, 0.0, 0.2]), 9);
        this.normalBuffer = JThreeContext.getInstance().ResourceManager.createBuffer("triangle-normals", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer.update(new Float32Array([0,1,-1,1,0,-1,-1,0,-1]),9);
    }
}

export=TriangleGeometry;
