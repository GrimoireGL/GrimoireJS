import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Color4 = require("../Base/Color/Color4");
import SolidColor = require("../Core/Materials/SolidColorMaterial");
import GridGeometry = require("../Core/Geometries/GridGeometry");
import Mesh = require('./Mesh');
import DepthMaterial = require('../Core/Materials/DepthStage/DepthStageMaterial');
import NormalMaterial=require('../Core/Materials/NormalMaterial');
class BasicObjectMesh extends Mesh
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super(geometry,mat);
            this.addMaterial(new DepthMaterial());
            this.addMaterial(new NormalMaterial());
        }
    }

export=BasicObjectMesh;
