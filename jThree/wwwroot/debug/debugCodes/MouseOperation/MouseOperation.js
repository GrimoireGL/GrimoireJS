j3(function() {
  const j3m = j3.Math;
  const viewport = j3("viewport").getObj(0);
  const axis = j3("#camera-axis").getObj(0);
  const camera = j3("camera").getObj(0);
  var accumX = 0;var accumY = 0;
  viewport.on("mouse-move", function(e) {
    if (e.mouseDownTracking) {
      accumX += e.diffX;
      accumY += e.diffY;
      console.log(accumX,accumY);
      axis.Transformer.Rotation = j3m.Quaternion.Euler(-accumY/300,-accumX/300,0);
    }
  });
  viewport.canvasElement.addEventListener("mousewheel",function(e){
    e.preventDefault();
    axis.Transformer.Position = j3m.Vector3.add(axis.Transformer.Position,camera.Transformer.forward.multiplyWith(e.wheelDelta/100));
  },true);
});
