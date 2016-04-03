j3(function(){
  setTimeout(function(){j3("#test").attr("position","0,0,-2")},3000);
  var q = new j3.Math.Quaternion([-0.5,-0.5,0.5,0.5]);
  console.log(q.toAngleAxisString());
});
