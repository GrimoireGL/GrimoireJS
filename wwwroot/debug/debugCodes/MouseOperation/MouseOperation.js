j3(function() {
  const j3m = j3.Math;
  const viewport = j3("viewport").getObj(0);
  const axis = j3("#camera-axis").getObj(0);
  const camera = j3("camera").getObj(0);
  var accumX = 0;var accumY = 0;
  viewport.on("mouse-move", function(e) {
    e.eventSource.preventDefault();
    console.log("axis: " + axis.Transformer.Rotation.toAngleAxisString());
    console.log("X: " + e.diffX + " Y: " + e.diffY);
    if (e.mouseDownTracking) {
      accumX += e.diffX;
      accumY += e.diffY;

      var diff = j3m.Quaternion.Multiply(j3m.Quaternion.AngleAxis(-e.diffY/10,axis.Transformer.right),j3m.Quaternion.AngleAxis(e.diffX/10,axis.Transformer.up));
      axis.Transformer.Rotation = j3m.Quaternion.Multiply(axis.Transformer.Rotation,diff);
      /*
      var diff = j3m.Quaternion.Multiply(j3m.Quaternion.AngleAxis(-e.diffY/100,axis.Transformer.right),j3m.Quaternion.AngleAxis(e.diffX/100,axis.Transformer.up));
      axis.Transformer.Rotation = j3m.Quaternion.Multiply(axis.Transformer.Rotation,diff);
      */
    }
  });
  viewport.canvasElement.addEventListener("mousewheel",function(e){
    e.preventDefault();
    axis.Transformer.Position = j3m.Vector3.add(axis.Transformer.Position,camera.Transformer.forward.multiplyWith(e.wheelDelta/100));
  },true);
});
