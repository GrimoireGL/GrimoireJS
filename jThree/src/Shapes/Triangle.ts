import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import BasicMaterial = require("../Core/Materials/BasicMaterial");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
import Geometry = require("../Core/Geometry");
class Triangle extends SceneObject
    {
        constructor(geometry:Geometry)
        {
            super();
            this.addMaterial(new BasicMaterial());
            this.geometry = geometry;
        }
    }

export=Triangle;
