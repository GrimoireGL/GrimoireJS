import SceneObject = require("../Core/SceneObject");
import Geometry = require("../Core/Geometries/Geometry");
import Material = require("../Core/Materials/Material");

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
