import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Mesh = require('./Mesh');
import GBufferMaterial = require("../Core/Materials/GBufferMaterial");
import ShadowMapMaterial = require("../Core/Materials/ShadowMapMaterial");
class BasicObjectMesh extends Mesh
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super(geometry,mat);
            this.addMaterial(new GBufferMaterial());
            this.addMaterial(new ShadowMapMaterial());
        }
    }

export=BasicObjectMesh;
