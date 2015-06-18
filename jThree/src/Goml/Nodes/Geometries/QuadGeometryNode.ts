import JThreeObject=require('Base/JThreeObject');
import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Vector3 = require("../../../Math/Vector3");
import JThreeContext = require("../../../Core/JThreeContext");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import BufferUsage = require("../../../Wrapper/BufferUsageType");
import ElementType = require("../../../Wrapper/ElementType");
import BufferTargetType = require("../../../Wrapper/BufferTargetType");
import Geometry = require("../../../Core/Geometries/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase
{
  private TriGeometry:QuadGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.TriGeometry=new QuadGeometry(this.Name);
  }

  beforeLoad()
  {
    super.beforeLoad();
  }
}

export=QuadGeometryNode;
