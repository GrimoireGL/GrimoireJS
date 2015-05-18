import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import BasicMaterial = require("../Core/Materials/BasicMaterial");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
import Geometry = require("../Core/Geometry");
import SolidColor = require("../Core/Materials/SolidColorMaterial");
import Color4 = require("../Base/Color/Color4");
class Triangle extends SceneObject
    {
        constructor(geometry:Geometry)
        {
            super();
            var c=new SolidColor();
            c.Color=Color4.parseColor('blue');
            this.addMaterial(c);
            this.geometry = geometry;
        }
    }

export=Triangle;
