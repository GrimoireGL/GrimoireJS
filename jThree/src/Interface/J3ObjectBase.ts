import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");

class J3ObjectBase {
  protected length: number = 0;

  protected set nodes(arr: GomlTreeNodeBase[]) {
    Array.prototype.splice.call(this, 0, this.length);
    Array.prototype.push.apply(this, arr);
  }
}

export = J3ObjectBase;
