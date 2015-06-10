import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");
import Color4 = require("../Base/Color/Color4");
import SolidColor = require("../Core/Materials/SolidColorMaterial");
import GridGeometry = require("../Core/Geometries/GridGeometry");
class Mesh extends SceneObject
    {
        constructor(geometry:Geometry,mat:Material)
        {
            super();
            if(mat)this.addMaterial(mat);
            if(geometry)this.geometry = geometry;
        }
    }

export=Mesh;
