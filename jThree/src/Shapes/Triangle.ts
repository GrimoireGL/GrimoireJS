import JThreeObject=require('Base/JThreeObject');
import SceneObject = require("../Core/SceneObject");
import BasicMaterial = require("../Core/Materials/BasicMaterial");
import TriangleGeometry = require("../Core/Geometries/TriangleGeometry");
class Triangle extends SceneObject
    {
        constructor()
        {
            super();
            this.addMaterial(new BasicMaterial());
            this.geometry = new TriangleGeometry();
        }
    }

export=Triangle;
