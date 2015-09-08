import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Mesh = require('./Mesh');
import GBufferMaterial = require("../Core/Materials/GBufferMaterial");
class BasicObjectMesh extends Mesh
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super(geometry,mat);
            this.addMaterial(new GBufferMaterial());
        }
    }

export=BasicObjectMesh;
