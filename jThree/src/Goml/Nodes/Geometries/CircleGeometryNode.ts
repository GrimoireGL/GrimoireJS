import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import CircleGeometry = require("../../../Core/Geometries/CircleGeometry");
import GomlAttribute = require("../../GomlAttribute");

class CircleGeometryNode extends GeometryNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "divide": {
        value: 30,
        converter: "int",
        onchanged: this._onDivideAttrChanged,
      }
    });
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return new CircleGeometry(name);
  }

  private _onDivideAttrChanged(attr: GomlAttribute): void {
    (<CircleGeometry>this.TargetGeometry).DiviceCount = attr.Value;
  }
}

export = CircleGeometryNode;
