import GeometryNodeBase = require("./GeometryNodeBase");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Vector3 = require("../../../Math/Vector3");
import Geometry = require("../../../Core/Geometries/Geometry");
import TriangleGeometry = require("../../../Core/Geometries/TriangleGeometry");

class GomlTreeTriNode extends GeometryNodeBase
{
  private TriGeometry:TriangleGeometry;

  constructor(parent:GomlTreeNodeBase)
  {
      super(parent);
      this.attributes.defineAttribute({
        'first': {
          value: new Vector3(-1, 0, 0),
          converter: 'vector3',
          handler: (v) => {
            this.TriGeometry.First = v.Value;
          },
        },
        'second': {
          value: new Vector3(0, 1, 0),
          converter: 'vector3',
          handler: (v) => {
            this.TriGeometry.Second = v.Value;
          },
        },
        'third': {
          value: new Vector3(1, 0, 0),
          converter: 'vector3',
          handler: (v) => {
            this.TriGeometry.Third = v.Value;
          },
        },
      });
  }

  protected ConstructGeometry():Geometry
  {
    return this.TriGeometry=new TriangleGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }
}

export=GomlTreeTriNode;
