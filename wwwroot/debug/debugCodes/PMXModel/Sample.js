function update(boneInput){
  var models = j3("pmx").getObj();
  models.forEach(function(e,i){
    if(!e.skeleton._bones[boneInput.value])return;
    var bone = e.skeleton._bones[boneInput.value];
    j3d.info.setInfo("モデル" + i,"Bone名:"+ bone.name+" Position:" + bone.Transformer.Position.toString() + " Rotation:" + bone.Transformer.Rotation.toAngleAxisString());
  });
}
j3(function(){
  var body = document.body;
  var input = document.createElement("input");
  var boneInput = document.createElement("input");
  window.boneInput = boneInput;
  input.setAttribute("type","number");
  input.value = 0;
  input.addEventListener("change",function(){
    j3("vmd").attr("frame",input.value + "");
    update(boneInput);
  });
  boneInput.value = 0;
  boneInput.setAttribute("type","number");
  boneInput.addEventListener("change",function(){
    update(boneInput);
  });
  body.appendChild(boneInput);
  body.appendChild(input);
  var j3m = j3.Math;
  var viewport = j3("viewport").getObj(0);
  var camera = j3("camera").getObj(0);
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
      camera.Transformer.Rotation = j3m.Quaternion.multiply(j3m.Quaternion.angleAxis(accumX/200,j3m.Vector3.YUnit),j3m.Quaternion.angleAxis(accumY/200,j3m.Vector3.XUnit));
    }
  });
  viewport.canvasElement.addEventListener("mousewheel",function(e){
    e.preventDefault();
    camera.Transformer.Position = j3m.Vector3.add(camera.Transformer.Position,camera.Transformer.forward.multiplyWith(e.wheelDelta/100));
  },true);
  setInterval(function(){
    update();
  },10);
});
