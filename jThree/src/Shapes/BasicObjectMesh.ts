import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Mesh = require('./Mesh');
import DepthMaterial = require('../Core/Materials/DepthStage/DepthStageMaterial');
import NormalMaterial = require('../Core/Materials/NormalMaterial');
import AlbedoMaterial = require("../Core/Materials/AlbedoMaterial");
class BasicObjectMesh extends Mesh
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super(geometry,mat);
            this.addMaterial(new DepthMaterial());
            this.addMaterial(new NormalMaterial());
            this.addMaterial(new AlbedoMaterial());
        }
    }

export=BasicObjectMesh;
