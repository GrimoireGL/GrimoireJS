import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CircleGeometry = require("../../../Core/Geometries/CircleGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlAttribute = require('../../GomlAttribute');

class CircleGeometryNode extends GeometryNodeBase {
  private geometry: CircleGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'divide': {
        value: 30,
        converter: 'int',
        onchanged: this._onDivideAttrChanged,
      }
    });
  }

  private _onDivideAttrChanged(attr: GomlAttribute): void {
    this.geometry.DiviceCount = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    this.geometry = new CircleGeometry(this.Name);
    return this.geometry;
  }



}

export =CircleGeometryNode
