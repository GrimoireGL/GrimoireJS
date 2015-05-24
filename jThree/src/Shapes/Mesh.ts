import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
import Geometry = require("../Core/Geometry");
import Material = require("../Core/Materials/Material");
import Color4 = require("../Base/Color/Color4");
import SolidColor = require("../Core/Materials/SolidColorMaterial");
import GridGeometry = require("../Core/Geometries/GridGeometry");
class Mesh extends SceneObject
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super();
            this.addMaterial(mat);
            this.geometry = geometry;
        }
    }

export=Mesh;
