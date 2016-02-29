j3(function() {
  const j3m = j3.Math;
  const viewport = j3("viewport").getObj(0);
  const camera = j3("camera").getObj(0);
  var accumX = 0;var accumY = 0;
  viewport.on("mouse-move", function(e) {
    e.eventSource.preventDefault();
    if (e.mouseDownTracking) {
      accumX += e.diffX;
      var restrict = 0.995;
      // Check camera looks above
      var above = j3m.Vector3.dot(j3m.Vector3.YUnit,camera.Transformer.forward);
      if((above < restrict || e.diffY < 0) && (above > -restrict || e.diffY > 0)){
        accumY += e.diffY;
      }
      camera.Transformer.Rotation = j3m.Quaternion.Multiply(j3m.Quaternion.AngleAxis(accumX/200,j3m.Vector3.YUnit),j3m.Quaternion.AngleAxis(accumY/200,j3m.Vector3.XUnit));
    }
  });
  viewport.canvasElement.addEventListener("mousewheel",function(e){
    e.preventDefault();
    axis.Transformer.Position = j3m.Vector3.add(axis.Transformer.Position,camera.Transformer.forward.multiplyWith(e.wheelDelta/100));
  },true);
});
