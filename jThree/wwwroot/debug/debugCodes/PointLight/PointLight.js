<<<<<<< HEAD
var j3m = j3.Math;
var RotationBehavior = function () {

};

RotationBehavior.prototype.update = function(v) {
  var q = v.attributes.getValue("rotation");
  var qd=j3m.Quaternion.AngleAxis(new Number(this.ratio),new (j3m.Vector3)(0, 1, 0));
  var q = j3m.Quaternion.Multiply(qd, q);
  v.attributes.setValue("rotation",q);
};

RotationBehavior.prototype.attributes =
{
  ratio: {
    converter: "number",
    value:0.02
  }
};

j3.defineBehavior("rotation", RotationBehavior);

j3(function () {

});
=======
>>>>>>> develop
